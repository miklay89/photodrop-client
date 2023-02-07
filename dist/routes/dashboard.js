"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_1 = __importDefault(require("../controllers/dashboard/dashboard"));
const check_token_1 = __importDefault(require("../middlewares/check_token"));
const router = (0, express_1.default)();
router.get("/get-all", check_token_1.default, dashboard_1.default.getAllAlbums);
router.get("/album/:id", check_token_1.default, dashboard_1.default.getAlbumById);
exports.default = router;
