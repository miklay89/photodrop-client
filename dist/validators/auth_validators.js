"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
class AuthValidator {
    constructor() {
        this.checkSendOtpBody = (req, res, next) => {
            try {
                const schema = joi_1.default.object({
                    phoneNumber: joi_1.default.number().required(),
                    countryCode: joi_1.default.number().required(),
                });
                const value = schema.validate(req.body);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
        this.checkVerifyOtpBody = (req, res, next) => {
            try {
                const schema = joi_1.default.object({
                    phoneNumber: joi_1.default.number().required(),
                    countryCode: joi_1.default.number().required(),
                    otp: joi_1.default.number().required(),
                });
                const value = schema.validate(req.body);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
        this.checkCookies = (req, res, next) => {
            try {
                const schema = joi_1.default.object({
                    refreshToken: joi_1.default.string().required(),
                });
                const value = schema.validate(req.cookies);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = new AuthValidator();
