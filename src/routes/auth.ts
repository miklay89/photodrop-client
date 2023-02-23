import Router from "express";
import AuthController from "../controllers/auth/auth";
import isAuthorized from "../middlewares/is_authorized";
import AuthValidator from "../validators/auth_validators";

const router = Router();

router.post(
  "/sign-in/send-otp",
  AuthValidator.checkSendOtpBody,
  AuthController.sendOtp,
);
router.post(
  "/sign-in/verify-otp",
  AuthValidator.checkVerifyOtpBody,
  AuthController.verifyOtp,
);
router.post("/refresh", AuthValidator.checkCookies, AuthController.refresh);
router.get("/me", isAuthorized, AuthController.me);

export default router;
