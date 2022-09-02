import express from "express";
import cardRouter from "./cardsRouter";

const router = express();

router.use(cardRouter);

export default router;
