"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const twilio_1 = require("twilio");
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../../data/db"));
const jwt_generator_1 = __importDefault(require("../../libs/jwt_generator"));
const get_client_id_from_token_1 = __importDefault(require("../../libs/get_client_id_from_token"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = new twilio_1.Twilio(accountSid, authToken);
const db = db_1.default.Connector;
const { clientTable, clientSessionsTable, clientSelfiesTable } = db_1.default.Tables;
class AuthController {
    constructor() {
        this.sendOtp = async (req, res, next) => {
            const countryCode = req.body.countryCode;
            const phoneNumber = req.body.phoneNumber;
            try {
                const otpRes = await client.verify
                    .services(serviceSid)
                    .verifications.create({
                    to: `+${countryCode}${phoneNumber}`,
                    channel: "sms",
                });
                res.status(200).json({ message: otpRes });
            }
            catch (e) {
                next(e);
            }
        };
        this.verifyOtp = async (req, res, next) => {
            const { countryCode, phoneNumber, otp } = req.body;
            try {
                await client.verify
                    .services(serviceSid)
                    .verificationChecks.create({
                    to: `+${countryCode}${phoneNumber}`,
                    code: otp,
                })
                    .then((r) => {
                    if (!r.valid)
                        throw boom_1.default.badRequest("Invalid otp code.");
                })
                    .catch(() => {
                    throw boom_1.default.badRequest("Invalid otp code.");
                });
                const user = await db
                    .select(clientTable)
                    .leftJoin(clientSelfiesTable, (0, expressions_1.eq)(clientTable.selfieId, clientSelfiesTable.selfieId))
                    .where((0, expressions_1.eq)(clientTable.phone, `${countryCode}${phoneNumber}`));
                if (user.length) {
                    const tokens = (0, jwt_generator_1.default)(user[0].pdc_client.clientId);
                    const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
                    const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
                    const newSession = {
                        sessionId: (0, uuid_1.v4)(),
                        clientId: user[0].pdc_client.clientId,
                        refreshToken: tokens.refreshToken,
                        expiresIn: sessionExpireTimestamp,
                    };
                    await db.insert(clientSessionsTable).values(newSession);
                    return res
                        .cookie("refreshToken", tokens.refreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                    })
                        .json({
                        accessToken: tokens.accessToken,
                        user: user[0].pdc_client,
                        selfie: user[0].pdc_selfies,
                    });
                }
                const newUser = {
                    clientId: (0, uuid_1.v4)(),
                    phone: `${countryCode}${phoneNumber}`,
                };
                const savedUser = await db
                    .insert(clientTable)
                    .values(newUser)
                    .returning();
                const tokens = (0, jwt_generator_1.default)(savedUser[0].clientId);
                const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
                const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
                const newSession = {
                    sessionId: (0, uuid_1.v4)(),
                    clientId: savedUser[0].clientId,
                    refreshToken: tokens.refreshToken,
                    expiresIn: sessionExpireTimestamp,
                };
                await db.insert(clientSessionsTable).values(newSession);
                return res
                    .cookie("refreshToken", tokens.refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                })
                    .json({
                    accessToken: tokens.accessToken,
                    user: savedUser[0],
                });
            }
            catch (e) {
                next(e);
            }
            return null;
        };
        this.refresh = async (req, res, next) => {
            const refreshToken = req.cookies.refreshToken;
            const timeStamp = new Date(Date.now()).toJSON();
            try {
                const sessionIsExist = await db
                    .select(clientSessionsTable)
                    .where((0, expressions_1.eq)(clientSessionsTable.refreshToken, refreshToken));
                if (!sessionIsExist.length)
                    throw boom_1.default.badRequest("Invalid refresh token.");
                if (Date.parse(timeStamp) >=
                    Date.parse(sessionIsExist[0].expiresIn)) {
                    await db
                        .delete(clientSessionsTable)
                        .where((0, expressions_1.eq)(clientSessionsTable.sessionId, sessionIsExist[0].sessionId));
                    return res
                        .status(401)
                        .json(boom_1.default.badRequest("Session is expired, please log-in."));
                }
                const newTokens = (0, jwt_generator_1.default)(sessionIsExist[0].clientId);
                const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
                const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
                const newSession = {
                    sessionId: sessionIsExist[0].sessionId,
                    clientId: sessionIsExist[0].clientId,
                    refreshToken: newTokens.refreshToken,
                    expiresIn: sessionExpireTimestamp,
                };
                await db
                    .update(clientSessionsTable)
                    .set(newSession)
                    .where((0, expressions_1.eq)(clientSessionsTable.sessionId, newSession.sessionId));
                return res
                    .cookie("refreshToken", newTokens.refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                })
                    .json({ accessToken: newTokens.accessToken });
            }
            catch (e) {
                next(e);
            }
            return null;
        };
        this.me = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            try {
                const user = await db
                    .select(clientTable)
                    .leftJoin(clientSelfiesTable, (0, expressions_1.eq)(clientTable.selfieId, clientSelfiesTable.selfieId))
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                return res.json({
                    user: user[0].pdc_client,
                    selfie: user[0].pdc_selfies,
                });
            }
            catch (e) {
                next(e);
            }
            return null;
        };
    }
}
exports.default = new AuthController();
