import sharp from "sharp";

const thumbnail = async (file: Buffer) => {
  const newFile = await sharp(file)
    .toFormat("jpeg")
    .jpeg()
    .resize(null, 400)
    .toBuffer();
  return newFile;
};

export default thumbnail;
