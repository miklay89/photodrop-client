"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../../data/db"));
const s3_1 = __importDefault(require("../../libs/s3"));
const convert_to_png_1 = __importDefault(require("../../libs/convert_to_png"));
const thumbnails_1 = __importDefault(require("../../libs/thumbnails"));
const get_client_id_from_token_1 = __importDefault(require("../../libs/get_client_id_from_token"));
dotenv_1.default.config();
const db = db_1.default.Connector;
const { clientSelfiesTable, clientTable } = db_1.default.Tables;
class UserController {
    constructor() {
        this.uploadSelfie = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            console.log("selfie", req.body);
            const selfie = req.file;
            const { shiftX, shiftY, zoom, width, height } = req.body;
            try {
                let file = selfie.buffer;
                let extName = selfie.originalname.split(".").pop()?.toLowerCase();
                if (selfie.originalname.split(".").pop()?.toLowerCase() === "heic") {
                    file = await (0, convert_to_png_1.default)(file);
                    extName = "png";
                }
                const selfieThumbnail = await (0, thumbnails_1.default)(file);
                const newSelfie = {
                    selfieId: (0, uuid_1.v4)(),
                    selfieUrl: await (0, s3_1.default)(file, extName),
                    selfieThumbnail: await (0, s3_1.default)(selfieThumbnail, "jpeg"),
                    shiftX: parseFloat(shiftX) || 0,
                    shiftY: parseFloat(shiftY) || 0,
                    zoom: parseFloat(zoom) || 0,
                    width: parseFloat(width) || 0,
                    height: parseFloat(height) || 0,
                };
                await db.insert(clientSelfiesTable).values(newSelfie);
                await db
                    .update(clientTable)
                    .set({ selfieId: newSelfie.selfieId })
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                const updatedUser = await db
                    .select(clientTable)
                    .leftJoin(clientSelfiesTable, (0, expressions_1.eq)(clientTable.selfieId, clientSelfiesTable.selfieId))
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                return res.status(200).json({
                    user: updatedUser[0].pdc_client,
                    selfie: updatedUser[0].pdc_selfies,
                });
            }
            catch (e) {
                next(e);
            }
            return null;
        };
        this.updateUserName = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            const { fullName } = req.body;
            try {
                await db
                    .update(clientTable)
                    .set({ fullName: fullName })
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                const updatedUser = await db
                    .select(clientTable)
                    .leftJoin(clientSelfiesTable, (0, expressions_1.eq)(clientTable.selfieId, clientSelfiesTable.selfieId))
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                res.status(200).json({
                    user: updatedUser[0].pdc_client,
                    selfie: updatedUser[0].pdc_selfies,
                });
            }
            catch (e) {
                next(e);
            }
            return null;
        };
        this.updateUserEmail = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            const { email } = req.body;
            try {
                await db
                    .update(clientTable)
                    .set({ email: email })
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                const updatedUser = await db
                    .select(clientTable)
                    .leftJoin(clientSelfiesTable, (0, expressions_1.eq)(clientTable.selfieId, clientSelfiesTable.selfieId))
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                res.status(200).json({
                    user: updatedUser[0].pdc_client,
                    selfie: updatedUser[0].pdc_selfies,
                });
            }
            catch (e) {
                next(e);
            }
            return null;
        };
    }
}
exports.default = new UserController();
