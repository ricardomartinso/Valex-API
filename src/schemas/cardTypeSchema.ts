import Joi from "joi";

export const cardTypeSchema = Joi.object({
  id: Joi.number().required(),
  type: Joi.string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});
