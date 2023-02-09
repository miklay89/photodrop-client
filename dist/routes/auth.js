"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth/auth"));
const is_authorized_1 = __importDefault(require("../middlewares/is_authorized"));
const auth_validators_1 = __importDefault(require("../validators/auth_validators"));
const router = (0, express_1.default)();
router.post("/sign-in/send-otp", auth_validators_1.default.checkSendOtpBody, auth_1.default.sendOtp);
router.post("/sign-in/verify-otp", auth_validators_1.default.checkVerifyOtpBody, auth_1.default.verifyOtp);
router.post("/refresh", auth_validators_1.default.checkCookies, auth_1.default.refresh);
router.get("/me", is_authorized_1.default, auth_1.default.me);
exports.default = router;
