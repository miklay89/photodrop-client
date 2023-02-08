"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_1 = __importDefault(require("../controllers/dashboard/dashboard"));
const is_authorized_1 = __importDefault(require("../middlewares/is_authorized"));
const router = (0, express_1.default)();
router.get("/get-all", is_authorized_1.default, dashboard_1.default.getAllAlbums);
router.get("/album/:id", is_authorized_1.default, dashboard_1.default.getAlbumById);
exports.default = router;
