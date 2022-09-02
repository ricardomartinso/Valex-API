import { createCard } from "../controllers/cardsController";
import { Router } from "express";
import { validateCreateCard } from "../middlewares/validateCreateCard";

const cardRouter = Router();

cardRouter.post("/card-create", validateCreateCard, createCard);

export default cardRouter;
