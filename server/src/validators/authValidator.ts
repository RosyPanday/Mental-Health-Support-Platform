import Joi from "joi";
import { alternativeSchema, numberSchema, stringSchema } from "./schemas.js";

const baseSignupFields = {
  username: stringSchema.min(3).max(30).label("Username").trim().required(),
  password: stringSchema.label("Password").trim().required(),
  phoneNumber: stringSchema.label("Phone Number").trim().required(),
  email: stringSchema.label("Email Address").trim().required(),
  name: stringSchema.label("Full Name").trim().required(),
  language: stringSchema.label("Language").trim().required(),
};

const emailSchema = stringSchema
  .label("Email")
  .trim()
  .email({ tlds: { allow: false } })
  .pattern(/@gmail\.com$/)
  .message('"Email" must be a valid @gmail.com address');

const phoneNumberSchema = stringSchema
  .label("Phone Number")
  .trim()
  .pattern(/^[0-9]{10}$/)
  .message('"Phone Number" must be exactly 10 digits');

const signupSchema = alternativeSchema.conditional(
  Joi.object({ role: "therapist" }).unknown(),
  {
    then: Joi.object({
      ...baseSignupFields,
      email: emailSchema.required(),
      rate: numberSchema.required().min(1000).max(2000),
      phoneNumber: phoneNumberSchema.required(),
      role: stringSchema.label("Role").trim().valid("therapist").required(),
      educationDegree: stringSchema.label("Education Degree").trim().required(),
      specialization: stringSchema.label("Specialization").trim().required(),
      yearsOfExperience: numberSchema.required().min(1).max(40),
    }),
    otherwise: Joi.object({
      ...baseSignupFields,
      email: emailSchema.required(),
      phoneNumber: phoneNumberSchema.required(),
      role: stringSchema.label("Role").trim().valid("patient").required(),
      age: numberSchema.label("Age").integer().min(10).max(80).required(),
      issues: stringSchema.label("Issues").trim().optional(),
      educationDegree: Joi.forbidden(),
      specialization: Joi.forbidden(),
      yearsOfExperience: Joi.forbidden(),
    }),
  },
);
const loginSchema = Joi.object({
  username: stringSchema.label("username").min(3).max(30).required(),
  password: stringSchema.label("password").required(),
  role: stringSchema
    .label("role")
    .valid("therapist", "patient", "admin")
    .required(),
});
export { signupSchema, loginSchema };
