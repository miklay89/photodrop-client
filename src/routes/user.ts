import Router from "express";
import checkTokens from "../middlewares/check_token";
import UserController from "../controllers/user/user";

const router = Router();
// upload selfie
router.post("/upload-selfie", checkTokens, UserController.uploadSelfie);
// update name
router.put("/update-name", checkTokens, UserController.updateUserName);
// update email
router.put("/update-email", checkTokens, UserController.updateUserEmail);

export default router;
