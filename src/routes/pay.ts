import Router from "express";
import PayController from "../controllers/pay/pay";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

// pay for user album
router.post(
  "/album/create-payment/:albumId",
  isAuthorized,
  PayController.createPaymentForAlbum,
);
// confirm payment
router.get(
  "/album/confirm-payment/:albumId",
  isAuthorized,
  PayController.confirmPaymentForAlbum,
);

export default router;
