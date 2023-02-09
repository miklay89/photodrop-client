"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
class UserValidator {
    constructor() {
        this.checkUpdateFullNameBody = (req, res, next) => {
            try {
                const schema = joi_1.default.object({
                    fullName: joi_1.default.string().required(),
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
        this.checkUpdateEmailBody = (req, res, next) => {
            try {
                const schema = joi_1.default.object({
                    email: joi_1.default.string().email().required(),
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
        this.checkUploadSelfieBody = (req, res, next) => {
            try {
                console.log("validator body", req.body);
                console.log("validator file", req.file);
                const bodySchema = joi_1.default.object({
                    shiftX: joi_1.default.number().required(),
                    shiftY: joi_1.default.number().required(),
                    zoom: joi_1.default.number().required(),
                    width: joi_1.default.number().required(),
                    height: joi_1.default.number().required(),
                });
                const fileSchema = joi_1.default.object().required().label("files");
                const valueBody = bodySchema.validate(req.body);
                if (valueBody.error?.message)
                    throw boom_1.default.badData(valueBody.error?.message);
                const valueFile = fileSchema.validate(req.file);
                if (valueFile.error?.message)
                    throw boom_1.default.badData(valueFile.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = new UserValidator();