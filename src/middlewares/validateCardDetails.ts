import { Request, Response, NextFunction } from "express";
import { cardBalanceSchema } from "../schemas/cardTypeSchema";

export async function validateCardDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cardInfo = req.body;
  const validation = cardBalanceSchema.validate(cardInfo, {
    abortEarly: false,
  });
  if (validation.error) {
    return res.status(422).send(
      validation.error.details.map((error) => {
        return error.message;
      })
    );
  }
  next();
}
