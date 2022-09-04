import {
  activateCreditCard,
  blockCreditCard,
  cardBalance,
  createCard,
  unblockCreditCard,
} from "../controllers/cardsController";
import { Router } from "express";
import { validateCreateCard } from "../middlewares/validateCreateCard";
import { validateCardDetails } from "../middlewares/validateCardDetails";
import { validateActivateCard } from "../middlewares/validateActivateCard";
import { validateBlockCard } from "../middlewares/validateBlockCard";

const cardRouter = Router();

cardRouter.post("/card-create", validateCreateCard, createCard);
cardRouter.post("/card-balance", validateCardDetails, cardBalance);
cardRouter.post("/card-activate", validateActivateCard, activateCreditCard);
cardRouter.post("/card-block", validateBlockCard, blockCreditCard);
cardRouter.post("/card-unblock", validateBlockCard, unblockCreditCard);

export default cardRouter;
