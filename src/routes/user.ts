import Router from "express";
import isAuthorized from "../middlewares/is_authorized";
import UserValidator from "../validators/user_validators";
import upload from "../libs/multer";
import UserController from "../controllers/user/user";

// upload selfie
const router = Router();
// upload selfie
router.post(
  "/upload-selfie",
  isAuthorized,
  upload.single("files"),
  UserValidator.checkUploadSelfieBody,
  UserController.uploadSelfie,
);
// update name
router.put(
  "/update-name",
  isAuthorized,
  UserValidator.checkUpdateFullNameBody,
  UserController.updateUserName,
);
// update email
router.put(
  "/update-email",
  isAuthorized,
  UserValidator.checkUpdateEmailBody,
  UserController.updateUserEmail,
);

export default router;
