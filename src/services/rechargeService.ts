import { findById } from "../repositories/cardRepository";
import { insert } from "../repositories/rechargeRepository";
import {
  checkCreditCardExpiration,
  isValidApiKeyCompanie,
} from "./cardsService";

export async function cardRecharge(apiKey: string, id: number, amount: number) {
  await isValidApiKeyCompanie(apiKey);

  const cardDetails = await findById(id);

  if (!cardDetails) {
    throw { error: "NotFound", message: "Card doesn't exist!" };
  }

  if (cardDetails.password === null) {
    throw { error: "Unauthorized", message: "Credit card not activated yet" };
  }

  checkCreditCardExpiration(cardDetails.expirationDate);

  const rechargeObject = {
    cardId: Number(cardDetails.id),
    amount,
  };

  insert(rechargeObject);
}
