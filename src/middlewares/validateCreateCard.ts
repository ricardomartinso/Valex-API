import { Request, Response, NextFunction } from "express";
import { createCardTypeSchema } from "../schemas/cardTypeSchema";

export async function validateCreateCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const card = req.body;

  const validation = createCardTypeSchema.validate(card, { abortEarly: false });

  if (validation.error) {
    return res.status(422).send(
      validation.error.details.map((error) => {
        return error.message;
      })
    );
  }
  next();
}
