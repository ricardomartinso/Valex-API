import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository";

import { checkCardCreation } from "../services/cardsService";
export async function createCard(req: Request, res: Response) {
  const employeeId = Number(req.body.id);
  const apiKey = req.header("x-api-key");
  const cardType = req.body.type;

  if (apiKey) {
    checkCardCreation(apiKey, employeeId, cardType);
  }

  res.status(201).send("Card created!");
}
