"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class User {
    constructor() {
        this.uploadSelfie = async (req, res, next) => {
            try {
                res.status(200).json({ message: "upload selfie" });
            }
            catch (e) {
                next(e);
            }
        };
        this.updateUserName = async (req, res, next) => {
            try {
                res.status(200).json({ message: "update user name" });
            }
            catch (e) {
                next(e);
            }
        };
        this.updateUserEmail = async (req, res, next) => {
            try {
                res.status(200).json({ message: "update user email" });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = new User();
