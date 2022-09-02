import { Request, Response, NextFunction } from "express";
export default function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("bafo");
  res.status(500).send("Houve um problema no servidor");
}
