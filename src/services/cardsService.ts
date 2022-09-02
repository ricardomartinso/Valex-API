import {
  findByTypeAndEmployeeId,
  TransactionTypes,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { faker } from "@faker-js/faker";

export async function checkCardCreation(
  apiKey: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  const creditCardNumber = faker.finance.creditCardNumber();
  console.log(creditCardNumber);
  const isExistingCompanie = await findByApiKey(apiKey);

  const isExistingEmployee = await findById(employeeId);

  const isRepeatedCardType = await findByTypeAndEmployeeId(
    cardType,
    employeeId
  );

  if (!isExistingCompanie) {
    throw { error: "NotFound", message: "Companie doesn't exist!" };
  }
  if (!isExistingEmployee) {
    throw { error: "NotFound", message: "Employee not registered!" };
  }
  if (isRepeatedCardType) {
    throw { error: "Conflict", message: "Card type already exist!" };
  }
}
