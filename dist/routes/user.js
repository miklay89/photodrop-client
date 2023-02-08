"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_authorized_1 = __importDefault(require("../middlewares/is_authorized"));
const user_validators_1 = require("../validators/user_validators");
const multer_1 = __importDefault(require("../libs/multer"));
const user_1 = __importDefault(require("../controllers/user/user"));
const router = (0, express_1.default)();
router.post("/upload-selfie", is_authorized_1.default, multer_1.default.single("files"), user_validators_1.checkUploadSelfieBody, user_1.default.uploadSelfie);
router.put("/update-name", is_authorized_1.default, user_validators_1.checkUpdateNameBody, user_1.default.updateUserName);
router.put("/update-email", is_authorized_1.default, user_validators_1.checkUpdateEmailBody, user_1.default.updateUserEmail);
exports.default = router;
