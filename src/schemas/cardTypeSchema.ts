import Joi from "joi";

export const createCardTypeSchema = Joi.object({
  id: Joi.number().required(),
  type: Joi.string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export const cardBalanceSchema = Joi.object({
  number: Joi.number().required(),
  cardHolderName: Joi.string().required(),
  expirationDate: Joi.date().required(),
});

export const creditCardActivation = Joi.object({
  number: Joi.number().required(),
  cardHolderName: Joi.string().required(),
  expirationDate: Joi.date().required(),
  cvc: Joi.number().required(),
  password: Joi.number().required(),
});

export const blockCardSchema = Joi.object({
  number: Joi.number().required(),
  cardHolderName: Joi.string().required(),
  expirationDate: Joi.date().required(),
  password: Joi.number().required(),
});
