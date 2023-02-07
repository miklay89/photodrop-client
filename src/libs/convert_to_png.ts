// eslint-disable-next-line import/no-extraneous-dependencies
import convert from "heic-convert";

const convertToPng = async (file: Buffer) => {
  const convertedFile = await convert({
    buffer: file,
    format: "PNG",
    quality: 1,
  });

  return convertedFile as Buffer;
};

export default convertToPng;
