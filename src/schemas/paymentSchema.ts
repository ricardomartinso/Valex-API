import Joi from "joi";

export const paymentSchema = Joi.object({
  id: Joi.number().required(),
  businessId: Joi.number().required(),
  password: Joi.number().required(),
  amount: Joi.number().positive().required(),
});
