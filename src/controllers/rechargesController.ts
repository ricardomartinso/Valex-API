import { Request, Response } from "express";
import { cardRecharge } from "../services/rechargeService";

export async function creditCardRecharge(req: Request, res: Response) {
  const apiKey = req.header("x-api-key");
  const { id, amount } = req.body;

  if (!apiKey) {
    return res.status(402).send("Invalid api-key");
  }

  await cardRecharge(apiKey, Number(id), amount);

  res.status(200).send("OK");
}
