"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../data/db"));
dotenv_1.default.config();
const db = db_1.default.Connector;
const { clientTable } = db_1.default.Tables;
const tokenSecret = process.env.TOKEN_SECRET;
const isAuthorized = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw boom_1.default.unauthorized("Invalid token.");
        }
        let decode;
        jsonwebtoken_1.default.verify(token, tokenSecret, (err, encoded) => {
            if (err)
                throw boom_1.default.unauthorized("Token expired");
            decode = encoded;
        });
        const user = await db
            .select(clientTable)
            .where((0, expressions_1.eq)(clientTable.clientId, decode.clientId));
        if (!user.length)
            throw boom_1.default.unauthorized("Invalid token.");
        req.body.decode = decode;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.default = isAuthorized;
