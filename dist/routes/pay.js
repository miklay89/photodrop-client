"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pay_1 = __importDefault(require("../controllers/pay/pay"));
const is_authorized_1 = __importDefault(require("../middlewares/is_authorized"));
const router = (0, express_1.default)();
router.post("/album/create-payment/:albumId", is_authorized_1.default, pay_1.default.createPaymentForAlbum);
router.get("/album/confirm-payment/:albumId/:clientId", pay_1.default.confirmPaymentForAlbum);
exports.default = router;
