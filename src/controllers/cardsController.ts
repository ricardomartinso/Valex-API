import { Request, Response } from "express";

import {
  activateCard,
  cardCreation,
  getCardBalance,
  blockCard,
  unblockCard,
} from "../services/cardsService";

export async function createCard(req: Request, res: Response) {
  const employeeId = Number(req.body.id);
  const apiKey = req.header("x-api-key");
  const cardType = req.body.type;

  if (!apiKey) {
    return res.status(402).send("Missing api-key");
  }

  await cardCreation(apiKey, employeeId, cardType);

  res.status(201).send("Created");
}
export async function activateCreditCard(req: Request, res: Response) {
  const { number, cvc, password, cardHolderName, expirationDate } = req.body;

  await activateCard(number, cvc, password, cardHolderName, expirationDate);

  res.status(201).send("Created");
}
export async function cardBalance(req: Request, res: Response) {
  const cardDetails = req.body;

  const balance = await getCardBalance(cardDetails);

  res.status(200).send(balance);
}

export async function blockCreditCard(req: Request, res: Response) {
  const { password, cardHolderName, expirationDate, number } = req.body;

  await blockCard(password, number, cardHolderName, expirationDate);

  res.status(200).send("OK");
}
export async function unblockCreditCard(req: Request, res: Response) {
  const { password, cardHolderName, expirationDate, number } = req.body;

  await unblockCard(password, number, cardHolderName, expirationDate);

  res.status(200).send("OK");
}
