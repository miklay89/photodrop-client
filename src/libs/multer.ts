// eslint-disable-next-line import/no-extraneous-dependencies
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
