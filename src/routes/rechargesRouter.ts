import { Router } from "express";
import { creditCardRecharge } from "../controllers/rechargesController";
import { validateCardRecharge } from "../middlewares/validateCardRecharge";

const rechargeRouter = Router();

rechargeRouter.post("/card-recharge", validateCardRecharge, creditCardRecharge);

export default rechargeRouter;
