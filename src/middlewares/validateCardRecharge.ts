import { Request, Response, NextFunction } from "express";
import { rechargeSchema } from "../schemas/rechargeSchema";

export async function validateCardRecharge(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const rechargeInfo = req.body;

  const validation = rechargeSchema.validate(rechargeInfo, {
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
