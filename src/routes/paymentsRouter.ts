import { Router } from "express";
import { creditCardPayment } from "../controllers/paymentsController";
import { validateCardPayment } from "../middlewares/validateCardPayment";

const paymentRouter = Router();

paymentRouter.post("/card-payment", validateCardPayment, creditCardPayment);

export default paymentRouter;
