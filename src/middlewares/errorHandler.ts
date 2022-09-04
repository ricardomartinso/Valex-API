import { Request, Response, NextFunction } from "express";
export default function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error) {
    if (error.error == "NotFound") {
      return res.status(404).send(error.message);
    }
    if (error.error == "Conflict") {
      return res.status(409).send(error.message);
    }
    if (error.error == "NotAuthorized") {
      return res.status(422).send(error.message);
    }
    if (error.error == "Unauthorized") {
      return res.status(401).send(error.message);
    }
  }

  return res.status(500).send("Server error has ocurred!");
}
