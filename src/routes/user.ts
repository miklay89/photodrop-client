import Router from "express";
import isAuthorized from "../middlewares/is_authorized";
import {
  checkUpdateEmailBody,
  checkUpdateNameBody,
  checkUploadSelfieBody,
} from "../validators/user_validators";
import upload from "../libs/multer";
import UserController from "../controllers/user/user";

const router = Router();
// upload selfie
router.post(
  "/upload-selfie",
  isAuthorized,
  upload.single("files"),
  checkUploadSelfieBody,
  UserController.uploadSelfie,
);
// update name
router.put(
  "/update-name",
  isAuthorized,
  checkUpdateNameBody,
  UserController.updateUserName,
);
// update email
router.put(
  "/update-email",
  isAuthorized,
  checkUpdateEmailBody,
  UserController.updateUserEmail,
);

export default router;
