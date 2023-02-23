import Router from "express";
import PayController from "../controllers/pay/pay";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

router.post(
  "/album/create-payment/:albumId",
  isAuthorized,
  PayController.createPaymentForAlbum,
);
router.get(
  "/album/confirm-payment/:albumId/:clientId",
  PayController.confirmPaymentForAlbum,
);

export default router;
