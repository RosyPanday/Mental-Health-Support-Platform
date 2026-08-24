import Joi from "joi";

export const confirmOrCancelBookingSchema = Joi.object({
  consultationId: Joi.number().integer().positive().required(),
  status: Joi.string().valid("confirmed", "cancelled").required(),

  reason: Joi.when("status", {
    is: "cancelled",
    then: Joi.string().trim().min(3).required().messages({
      "string.empty": "A reason is required when cancelling a booking",
      "string.min": "Reason must be at least 3 characters long",
      "any.required": "Reason is required when status is cancelled",
    }),
    otherwise: Joi.string().trim().optional().allow("", null),
  }),
});
