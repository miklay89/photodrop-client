"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pay_1 = __importDefault(require("../controllers/pay/pay"));
const check_token_1 = __importDefault(require("../middlewares/check_token"));
const router = (0, express_1.default)();
router.post("/album", check_token_1.default, pay_1.default.payForAlbum);
exports.default = router;
