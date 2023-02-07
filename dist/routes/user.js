"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_token_1 = __importDefault(require("../middlewares/check_token"));
const user_1 = __importDefault(require("../controllers/user/user"));
const router = (0, express_1.default)();
router.post("/upload-selfie", check_token_1.default, user_1.default.uploadSelfie);
router.put("/update-name", check_token_1.default, user_1.default.updateUserName);
router.put("/update-email", check_token_1.default, user_1.default.updateUserEmail);
exports.default = router;
