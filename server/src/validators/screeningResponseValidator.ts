import Joi from "joi";
import { arraySchema, numberSchema } from "./schemas.js";

const phqNineSchema = Joi.object({
  responses: arraySchema
    .items(numberSchema.min(0).max(3).required())
    .length(9)
    .required(),
});

export { phqNineSchema };
