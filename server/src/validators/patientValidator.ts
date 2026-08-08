import Joi from "joi";
import { stringSchema } from "./schemas.js";

export const descriptionSchema = Joi.object({
  description: stringSchema.required().min(10).max(100),
});
