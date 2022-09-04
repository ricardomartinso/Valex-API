import { findById } from "../repositories/cardRepository";
import {
  checkCreditCardExpiration,
  isValidApiKeyCompanie,
  verifyPassword,
} from "./cardsService";

export async function cardPayment(
  apiKey: string,
  id: number,
  amount: string,
  password: string
) {
  const cardDetails = await findById(id);

  //verifica cartao cadastrado
  if (!cardDetails) {
    throw { error: "NotFound", message: "Card doesn't exist!" };
  }

  //verifica cartao ativado
  if (cardDetails.password === null) {
    throw { error: "Unauthorized", message: "Credit card not activated yet" };
  }

  //verifica expiraçao do cartao
  checkCreditCardExpiration(cardDetails.expirationDate);

  //verifica cartao bloqueado
  checkIsCardBlocked(cardDetails.isBlocked);

  //verifica se a senha passada é valida
  verifyPassword(password, cardDetails.password as string);
}

function checkIsCardBlocked(isBlocked: boolean) {
  if (isBlocked === true) {
    throw { error: "Unauthorized", message: "Card is blocked!" };
  }
}
