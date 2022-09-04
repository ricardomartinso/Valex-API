import { Request, Response, NextFunction } from "express";
import { blockCardSchema } from "../schemas/cardTypeSchema";

export async function validateBlockCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cardInfo = req.body;

  const validation = blockCardSchema.validate(cardInfo, {
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
