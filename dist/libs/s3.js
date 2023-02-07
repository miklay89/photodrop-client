"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey,
});
const uploadFileToS3 = async (file, extName) => {
    const uploadParams = {
        Bucket: bucketName,
        Body: file,
        Key: `${(0, uuid_1.v4)()}.${extName}`,
    };
    const result = await s3.upload(uploadParams).promise();
    return result.Location;
};
exports.default = uploadFileToS3;
