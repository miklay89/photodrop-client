"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const getClientIdFromToken = (token) => {
    const decode = jsonwebtoken_1.default.verify(token, tokenSecret);
    return decode.clientId;
};
exports.default = getClientIdFromToken;
