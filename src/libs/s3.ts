import S3 from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFileToS3 = async (file: Buffer, extName: string) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    Key: `selfie-${uuid()}.${extName}`,
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location;
};

export default uploadFileToS3;
