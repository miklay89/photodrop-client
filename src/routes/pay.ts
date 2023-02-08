import Router from "express";
import PayController from "../controllers/pay/pay";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

// pay for user album
router.post("/album", isAuthorized, PayController.payForAlbum);

export default router;
