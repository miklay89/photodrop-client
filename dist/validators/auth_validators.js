"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCookies = exports.checkVerifyOtpBody = exports.checkSendOtpBody = void 0;
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
const checkSendOtpBody = (req, res, next) => {
    const schema = joi_1.default.object({
        phoneNumber: joi_1.default.number().required(),
        countryCode: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error?.message)
        throw boom_1.default.badData(value.error?.message);
    next();
};
exports.checkSendOtpBody = checkSendOtpBody;
const checkVerifyOtpBody = (req, res, next) => {
    const schema = joi_1.default.object({
        phoneNumber: joi_1.default.number().required(),
        countryCode: joi_1.default.number().required(),
        otp: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error?.message)
        throw boom_1.default.badData(value.error?.message);
    next();
};
exports.checkVerifyOtpBody = checkVerifyOtpBody;
const checkCookies = (req, res, next) => {
    const schema = joi_1.default.object({
        refreshToken: joi_1.default.string().required(),
    });
    const value = schema.validate(req.cookies);
    if (value.error?.message)
        throw boom_1.default.badData(value.error?.message);
    next();
};
exports.checkCookies = checkCookies;
