"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const tokenSecret = process.env.TOKEN_SECRET;
function createTokens(clientId) {
    const accessToken = jsonwebtoken_1.default.sign({
        clientId,
    }, tokenSecret, {
        expiresIn: "24h",
    });
    const refreshToken = (0, uuid_1.v4)();
    const tokens = {
        accessToken,
        refreshToken,
    };
    return tokens;
}
exports.default = createTokens;
