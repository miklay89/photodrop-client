import Router from "express";
import AuthController from "../controllers/auth/auth";
import isAuthorized from "../middlewares/is_authorized";
import AuthValidator from "../validators/auth_validators";

const router = Router();

// sign-in
router.post(
  "/sign-in/send-otp",
  AuthValidator.checkSendOtpBody,
  AuthController.sendOtp,
);
// login
router.post(
  "/sign-in/verify-otp",
  AuthValidator.checkVerifyOtpBody,
  AuthController.verifyOtp,
);
// refresh token
router.post("/refresh", AuthValidator.checkCookies, AuthController.refresh);
// get user info
router.get("/me", isAuthorized, AuthController.me);

export default router;
