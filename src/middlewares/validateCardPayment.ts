import { Request, Response, NextFunction } from "express";
import { paymentSchema } from "../schemas/paymentSchema";

export async function validateCardPayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const paymentInfo = req.body;

  const validation = paymentSchema.validate(paymentInfo, {
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
