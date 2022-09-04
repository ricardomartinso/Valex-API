import express from "express";
import cardRouter from "./cardsRouter";
import paymentRouter from "./paymentsRouter";
import rechargeRouter from "./rechargesRouter";

const router = express();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(paymentRouter);

export default router;
