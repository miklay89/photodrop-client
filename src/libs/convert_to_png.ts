import convert from "heic-convert";

const convertToPng = async (file: Buffer) => {
  const convertedFile = await convert({
    buffer: file,
    format: "PNG",
    quality: 1,
  });

  return Buffer.from(convertedFile);
};

export default convertToPng;
