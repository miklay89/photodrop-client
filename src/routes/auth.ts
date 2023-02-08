import Router from "express";
import AuthController from "../controllers/auth/auth";
import isAuthorized from "../middlewares/is_authorized";
import {
  checkSendOtpBody,
  checkVerifyOtpBody,
  checkCookies,
} from "../validators/auth_validators";

const router = Router();

// sign-in
router.post("/sign-in/send-otp", checkSendOtpBody, AuthController.sendOtp);
// login
router.post(
  "/sign-in/verify-otp",
  checkVerifyOtpBody,
  AuthController.verifyOtp,
);
// refresh token
router.post("/refresh", checkCookies, AuthController.refresh);
// TODO - delete on prod (me - check access)
router.get("/me", isAuthorized, AuthController.me);

export default router;
