"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Dashboard {
    constructor() {
        this.getAllAlbums = async (req, res, next) => {
            try {
                res.status(200).json({ message: "get all user albums" });
            }
            catch (e) {
                next(e);
            }
        };
        this.getAlbumById = async (req, res, next) => {
            try {
                res.status(200).json({ message: "get albums by album id" });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = new Dashboard();
