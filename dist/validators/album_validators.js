"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlbumBody = void 0;
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
const createAlbumBody = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        datapicker: joi_1.default.string().required(),
        decode: joi_1.default.object({
            userId: joi_1.default.string().required(),
            iat: joi_1.default.number().required(),
            exp: joi_1.default.number().required(),
        }).required(),
    });
    try {
        const value = schema.validate(req.body);
        if (value.error?.message)
            throw new Error(value.error?.message);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
};
exports.createAlbumBody = createAlbumBody;
