import Joi from "joi";
import { numberSchema, stringSchema } from "./schemas.js";

export const descriptionSchema = Joi.object({
  description: stringSchema.required().min(10).max(100),
});

export const requestConsultationSchema = Joi.object({
  preferredTime: Joi.date().iso().greater("now").required().messages({
    "date.greater": "Preferred time must be set to a future date and time.",
    "date.format": "Preferred time must be a valid ISO date string.",
    "any.required": "Preferred time is required.",
  }),
  therapistId: numberSchema.required(),
});
