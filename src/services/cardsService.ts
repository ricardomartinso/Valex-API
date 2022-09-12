import {
  findByCardDetails,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  update,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import { findByCardId as findCardPayments } from "../repositories/paymentRepository";
import { findByCardId as findCardRecharges } from "../repositories/rechargeRepository";

dotenv.config();

export async function cardCreation(
  apiKey: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  const date = dayjs();

  await isValidApiKeyCompanie(apiKey);
  const employee = await isEmployeeExist(employeeId);
  await cardAlreadyExist(cardType, employeeId);

  const creditCardNumber = faker.finance.creditCardNumber("################");
  const cardholderName = generateCardName(employee.fullName);
  const expirationDate = date.add(5, "year").format("MM/YY");

  const securityCode = faker.finance.creditCardCVV();
  const encryptedCvc = encryptValue(securityCode);

  const cardObject = {
    employeeId,
    number: creditCardNumber,
    cardholderName,
    securityCode: encryptedCvc,
    expirationDate,
    password: undefined,
    isVirtual: true,
    originalCardId: undefined,
    isBlocked: true,
    type: cardType,
  };

  insert(cardObject);

  return cardObject;
}

function encryptValue(value: string) {
  const privateKey = process.env.SECRET_KEY as string;
  const cryptr = new Cryptr(privateKey);

  const encryptedValue = cryptr.encrypt(value);

  return encryptedValue;
}
function decryptValue(value: string) {
  const privateKey = process.env.SECRET_KEY as string;
  const cryptr = new Cryptr(privateKey);

  const decryptedValue = cryptr.decrypt(value);

  return decryptedValue;
}
export async function getCardBalance(card: {
  number: string;
  cardHolderName: string;
  expirationDate: string;
}) {
  const { id: cardId } = await creditCardExist(card);

  const cardPayments = await findCardPayments(cardId);
  const cardRecharges = await findCardRecharges(cardId);

  const balance = calculateCardBalance(cardPayments, cardRecharges);

  return balance;
}
export async function activateCard(
  number: string,
  cvc: string,
  password: string,
  cardHolderName: string,
  expirationDate: string
) {
  const privateKey = process.env.SECRET_KEY as string;
  const cryptr = new Cryptr(privateKey);

  const card = {
    number,
    cardHolderName,
    expirationDate,
  };

  const cardDetails = await creditCardExist(card);

  checkCreditCardExpiration(cardDetails.expirationDate);

  validateCreatePassword(cardDetails.password as string | null, password);

  checkCreditCardCvc(cardDetails.securityCode, cvc);

  const encryptedPassword = cryptr.encrypt(password);

  cardDetails.password = encryptedPassword;
  cardDetails.isBlocked = false;

  await update(cardDetails.id, cardDetails);
}

function validateCreatePassword(
  passwordReceived: string | null,
  passwordToCreate: string
) {
  if (passwordReceived !== null) {
    throw { error: "Unauthorized", message: "Card already activated" };
  }

  if (passwordToCreate.length < 4) {
    throw {
      error: "Unauthorized",
      message: "Password need to be 4 digits length",
    };
  }
}
export async function blockCard(
  password: string,
  number: string,
  cardHolderName: string,
  expirationDate: string
) {
  const card = {
    number,
    cardHolderName,
    expirationDate,
  };
  const cardDetails = await creditCardExist(card);

  checkCreditCardExpiration(cardDetails.expirationDate);

  checkIsCardBlocked(cardDetails.isBlocked);

  verifyPassword(password, cardDetails.password as string);

  cardDetails.isBlocked = true;

  update(cardDetails.id, cardDetails);
}
export async function unblockCard(
  password: string,
  number: string,
  cardHolderName: string,
  expirationDate: string
) {
  const card = {
    number,
    cardHolderName,
    expirationDate,
  };
  const cardDetails = await creditCardExist(card);

  checkCreditCardExpiration(cardDetails.expirationDate);

  checkIsCardUnblocked(cardDetails.isBlocked);

  verifyPassword(password, cardDetails.password as string);

  cardDetails.isBlocked = false;

  update(cardDetails.id, cardDetails);
}

function checkIsCardBlocked(isBlocked: boolean) {
  if (isBlocked === true) {
    throw { error: "Unauthorized", message: "Card already blocked!" };
  }
}
function checkIsCardUnblocked(isBlocked: boolean) {
  if (isBlocked === false) {
    throw { error: "Unauthorized", message: "Card already unblocked!" };
  }
}
export function verifyPassword(password: string, encryptedPassword: string) {
  const privateKey = process.env.SECRET_KEY as string;
  const cryptr = new Cryptr(privateKey);

  const decryptedPassword = cryptr.decrypt(encryptedPassword);

  if (password !== decryptedPassword) {
    throw { error: "Unauthorized", message: "Password does not match!" };
  }
}

function checkCreditCardCvc(encryptedCvc: string, cvc: string) {
  const privateKey = process.env.SECRET_KEY as string;
  const cryptr = new Cryptr(privateKey);
  const decryptedCvc = cryptr.decrypt(encryptedCvc);

  if (cvc !== decryptedCvc) {
    throw { error: "NotAuthorized", message: "CVC does not match!" };
  }
}
export function checkCreditCardExpiration(expirationDate: string) {
  const checkCardExpiration = dayjs(expirationDate).diff(
    dayjs().format("MM/YY")
  );
  if (checkCardExpiration < 0) {
    throw { error: "NotAllowed", message: "Your credit card has expirated" };
  }
}
function calculateCardBalance(payments: any[], recharges: any[]) {
  const totalPayments: number = payments.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );

  const totalRecharges: number = recharges.reduce(
    (previousValue, currentValue) => previousValue + currentValue.amount,
    0
  );

  return {
    balance: totalRecharges - totalPayments,
    transctions: payments,
    recharges,
  };
}
async function creditCardExist(card: {
  number: string;
  cardHolderName: string;
  expirationDate: string;
}) {
  const creditCard = await findByCardDetails(
    card.number,
    card.cardHolderName,
    card.expirationDate
  );

  if (!creditCard) {
    throw { error: "NotFound", message: "Card doesn't exist!" };
  }

  return creditCard;
}
export async function isValidApiKeyCompanie(apiKey: string) {
  const isApiValid = await findByApiKey(apiKey);
  if (!isApiValid) {
    throw { error: "NotFound", message: "Api key doesnt match any Companie!" };
  }
}
async function isEmployeeExist(employeeId: number) {
  const employeeExist = await findById(employeeId);

  if (!employeeExist) {
    throw { error: "NotFound", message: "Employee not registered!" };
  }

  return employeeExist;
}
async function cardAlreadyExist(
  cardType: TransactionTypes,
  employeeId: number
) {
  const cardExist = await findByTypeAndEmployeeId(cardType, employeeId);

  if (cardExist) {
    throw { error: "Conflict", message: "Card type already exist!" };
  }
}

function generateCardName(nameToConvert: string) {
  const splitName = nameToConvert.split(" ");

  const cardName = splitName
    .map((name: string, index: number) => {
      if (index === 0 || index === splitName.length - 1) {
        return name;
      } else if (name.length >= 3) {
        return name[0];
      } else {
        return "";
      }
    })
    .filter((name: string) => name !== "")
    .join(" ");

  return cardName.toUpperCase();
}
