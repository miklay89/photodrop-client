import Router from "express";
import DashboardController from "../controllers/dashboard/dashboard";
import checkToken from "../middlewares/check_token";

const router = Router();

// get all users albums
router.get("/get-all", checkToken, DashboardController.getAllAlbums);
// get album by album id
router.get("/album/:id", checkToken, DashboardController.getAlbumById);

export default router;
