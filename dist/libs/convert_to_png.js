"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const heic_convert_1 = __importDefault(require("heic-convert"));
const convertToPng = async (file) => {
    const convertedFile = await (0, heic_convert_1.default)({
        buffer: file,
        format: "PNG",
        quality: 1,
    });
    return convertedFile;
};
exports.default = convertToPng;
