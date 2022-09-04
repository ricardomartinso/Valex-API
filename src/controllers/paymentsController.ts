import { Request, Response } from "express";
import { cardPayment } from "../services/paymentService";

export async function creditCardPayment(req: Request, res: Response) {
  const apiKey = req.header("x-api-key");
  const { id, amount, password } = req.body;

  if (!apiKey) {
    return res.status(402).send("Invalid api-key");
  }

  await cardPayment(apiKey, Number(id), amount, password);
  res.status(200).send("OK");
}
