import Router from "express";
import DashboardController from "../controllers/dashboard/dashboard";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

// get all users albums
router.get("/get-all", isAuthorized, DashboardController.getAllAlbums);
// get album by album id
router.get("/album/:albumId", isAuthorized, DashboardController.getAlbumById);

export default router;
