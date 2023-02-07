import Router from "express";
import PayController from "../controllers/pay/pay";
import checkToken from "../middlewares/check_token";

const router = Router();

// pay for user album
router.post("/album", checkToken, PayController.payForAlbum);

export default router;
