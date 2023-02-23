import Router from "express";
import DashboardController from "../controllers/dashboard/dashboard";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

router.get("/get-all", isAuthorized, DashboardController.getAllAlbums);
router.get("/album/:albumId", isAuthorized, DashboardController.getAlbumById);

export default router;
