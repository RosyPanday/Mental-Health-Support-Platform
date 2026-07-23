import Joi from "joi";
import { alternativeSchema, numberSchema, stringSchema } from "./schemas.js";

const baseSignupFields = {
  username: stringSchema.label("Username").trim().required(),
  password: stringSchema.label("Password").trim().required(),
  phoneNumber: stringSchema.label("Phone Number").trim().required(),
  email: stringSchema.label("Email Address").trim().required(),
  name: stringSchema.label("Full Name").trim().required(),
  language: stringSchema.label("Language").trim().required(),
};

const signupSchema = alternativeSchema.conditional(
  Joi.object({ role: "therapist" }).unknown(),
  {
    then: Joi.object({
      ...baseSignupFields,
      role: stringSchema.label("Role").trim().valid("therapist").required(),
      educationDegree: stringSchema.label("Education Degree").trim().required(),
      specialization: stringSchema.label("Specialization").trim().required(),
      yearsOfExperience: numberSchema.label("Years of Experience").required(),
    }),
    otherwise: Joi.object({
      ...baseSignupFields,
      role: stringSchema.label("Role").trim().valid("patient").required(),
      //blocking patients from entering these data
      educationDegree: Joi.forbidden(),
      specialization: Joi.forbidden(),
      yearsOfExperience: Joi.forbidden(),
    }),
  },
);

export { signupSchema };
