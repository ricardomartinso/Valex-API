import { findById } from "../repositories/cardRepository";
import {
  checkCreditCardExpiration,
  isValidApiKeyCompanie,
  verifyPassword,
} from "./cardsService";
import {
  findByCardId as findCardPayments,
  insert,
} from "../repositories/paymentRepository";
import { findByCardId as findCardRecharges } from "../repositories/rechargeRepository";
import { findById as findBusinessById } from "../repositories/businessRepository";

export async function cardPayment(
  apiKey: string,
  id: number,
  amount: string,
  password: string,
  businessId: number
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

  //verifica se é um estabelecimento válido
  const businessDetails = await verifyIsBusinessValid(businessId);

  //verifica se o tipo do cartao é igual ao do estabelecimento
  isTypeEqual(cardDetails.type, businessDetails.type);

  //verifica saldo do cartao
  await hasSufficientFunds(id, amount);

  const payment = {
    cardId: id,
    businessId,
    amount: Number(amount),
  };

  insert(payment);
}

function checkIsCardBlocked(isBlocked: boolean) {
  if (isBlocked === true) {
    throw { error: "Unauthorized", message: "Card is blocked!" };
  }
}
async function verifyIsBusinessValid(businessId: number) {
  const businessExist = await findBusinessById(businessId);

  if (!businessExist) {
    throw { error: "NotFound", message: "Business not found!" };
  }

  return businessExist;
}
function isTypeEqual(creditCardType: string, businessType: string) {
  if (creditCardType !== businessType) {
    throw {
      error: "Unauthorized",
      message: "Credit card type doesn't match with business",
    };
  }
}
async function hasSufficientFunds(id: number, amount: string) {
  const cardPayments = await findCardPayments(id);
  const cardRecharges = await findCardRecharges(id);

  const totalPayments: number = cardPayments.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );
  const totalRecharges: number = cardRecharges.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );

  const balance = totalRecharges - totalPayments;

  if (balance >= Number(amount)) {
    return true;
  } else {
    throw { error: "Unauthorized", message: "No sufficients funds" };
  }

  return totalRecharges - totalPayments;
}
