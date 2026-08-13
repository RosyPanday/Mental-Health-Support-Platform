import * as yup from "yup";

import type { PreferredLanguage, SignupRole, UserRole } from "../types/auth";

const usernameSchema = yup
  .string()
  .trim()
  .required("Enter your username.")
  .min(3, "Username must contain at least 3 characters.")
  .max(50, "Username cannot exceed 50 characters.");

export const loginSchema = yup.object({
  role: yup
    .mixed<UserRole>()
    .oneOf(["patient", "therapist", "admin"], "Choose how you are signing in.")
    .required("Choose how you are signing in."),
  username: usernameSchema,
  password: yup
    .string()
    .required("Enter your password.")
    .max(128, "Password cannot exceed 128 characters."),
});

export const signupSchema = yup.object({
  role: yup
    .mixed<SignupRole>()
    .oneOf(["patient", "therapist"], "Choose how you will use the platform.")
    .required("Choose how you will use the platform."),
  name: yup
    .string()
    .trim()
    .required("Enter your full name.")
    .min(2, "Full name must contain at least 2 characters.")
    .max(80, "Full name cannot exceed 80 characters."),
  username: usernameSchema.matches(
    /^[a-zA-Z0-9._-]+$/,
    "Use only letters, numbers, dots, underscores, or hyphens.",
  ),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Enter your email address.")
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),
  phoneNumber: yup
    .string()
    .trim()
    .required("Enter your phone number.")
    .matches(/^\d{10}$/, "Enter a valid 10-digit phone number."),
  password: yup
    .string()
    .required("Create a password.")
    .min(8, "Password must contain at least 8 characters.")
    .max(128, "Password cannot exceed 128 characters.")
    .matches(/[A-Za-z]/, "Password must include at least one letter.")
    .matches(/[0-9]/, "Password must include at least one number."),
  language: yup
    .mixed<PreferredLanguage>()
    .oneOf(["nepali", "english"], "Choose your preferred language.")
    .required("Choose your preferred language."),
  age: yup
    .string()
    .defined()
    .when("role", {
      is: "patient",
      then: (schema) =>
        schema
          .trim()
          .required("Enter your age.")
          .matches(/^\d+$/, "Age must be a whole number.")
          .test("age-range", "Age must be between 1 and 120.", (value) => {
            const parsedAge = Number(value);
            return value !== undefined && !Number.isNaN(parsedAge) && parsedAge >= 1 && parsedAge <= 120;
          }),
      otherwise: (schema) => schema.transform(() => ""),
    }),
  issues: yup
    .string()
    .defined()
    .when("role", {
      is: "patient",
      then: (schema) =>
        schema
          .trim()
          .max(500, "Issues cannot exceed 500 characters."),
      otherwise: (schema) => schema.transform(() => ""),
    }),
  yearsOfExperience: yup
    .string()
    .defined()
    .when("role", {
      is: "therapist",
      then: (schema) =>
        schema
          .trim()
          .required("Enter your years of professional experience.")
          .matches(/^\d+$/, "Years of experience must be a whole number.")
          .test(
            "experience-range",
            "Years of experience must be between 1 and 40.",
            (value) => value !== undefined && Number(value) >= 1 && Number(value) <= 40,
          ),
      otherwise: (schema) => schema.transform(() => ""),
    }),
  rate: yup
    .string()
    .defined()
    .when("role", {
      is: "therapist",
      then: (schema) =>
        schema
          .trim()
          .required("Enter your session rate.")
          .matches(/^\d+$/, "Session rate must be a whole number.")
          .test(
            "rate-range",
            "Session rate must be between Rs. 1,000 and Rs. 2,000.",
            (value) => value !== undefined && Number(value) >= 1000 && Number(value) <= 2000,
          ),
      otherwise: (schema) => schema.transform(() => ""),
    }),
  specialization: yup
    .string()
    .defined()
    .when("role", {
      is: "therapist",
      then: (schema) =>
        schema
          .trim()
          .required("Enter your area of specialization.")
          .min(2, "Specialization must contain at least 2 characters.")
          .max(100, "Specialization cannot exceed 100 characters."),
      otherwise: (schema) => schema.transform(() => ""),
    }),
  educationDegree: yup
    .string()
    .defined()
    .when("role", {
      is: "therapist",
      then: (schema) =>
        schema
          .trim()
          .required("Enter your highest relevant education degree.")
          .min(2, "Education degree must contain at least 2 characters.")
          .max(120, "Education degree cannot exceed 120 characters."),
      otherwise: (schema) => schema.transform(() => ""),
    }),
});

export const therapistSearchSchema = yup.object({
  description: yup
    .string()
    .trim()
    .required("Describe the kind of support you are looking for.")
    .min(10, "Add a little more detail so we can find a relevant therapist.")
    .max(600, "Description cannot exceed 600 characters."),
});

export const consultationTimeSchema = yup.object({
  preferredTime: yup
    .string()
    .required("Choose your preferred consultation time.")
    .test("valid-date", "Choose a valid date and time.", (value) => {
      if (!value) return true;
      return !Number.isNaN(new Date(value).getTime());
    })
    .test("future-date", "Choose a consultation time in the future.", (value) => {
      if (!value) return true;
      const timestamp = new Date(value).getTime();
      return !Number.isNaN(timestamp) && timestamp > Date.now();
    }),
});

export const cancellationSchema = yup.object({
  reason: yup
    .string()
    .trim()
    .required("Provide a reason before cancelling this consultation.")
    .min(10, "Provide at least 10 characters so the patient understands the decision.")
    .max(500, "Cancellation reason cannot exceed 500 characters."),
});

const screeningAnswerSchema = yup
  .number()
  .typeError("Choose one response.")
  .integer()
  .oneOf([0, 1, 2, 3], "Choose one of the available responses.")
  .required("Choose one response.");

export const screeningSchema = yup.object({
  responses: yup
    .array()
    .of(screeningAnswerSchema)
    .required()
    .length(9, "Answer all nine questions before continuing."),
});

const MAX_DOCUMENT_SIZE = 8 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

function fileListSchema(label: string, allowedTypes: string[]) {
  return yup
    .mixed<FileList>()
    .required(`${label} is required.`)
    .test("file-required", `${label} is required.`, (files) => Boolean(files?.length))
    .test(
      "file-type",
      `${label} must use one of the listed file formats.`,
      (files) => !files?.[0] || allowedTypes.includes(files[0].type),
    )
    .test(
      "file-size",
      `${label} must be 8 MB or smaller.`,
      (files) => !files?.[0] || files[0].size <= MAX_DOCUMENT_SIZE,
    );
}

export const therapistDocumentsSchema = yup.object({
  profilePic: fileListSchema("Professional profile photo", IMAGE_TYPES),
  educationalDoc1: fileListSchema("Primary education record", DOCUMENT_TYPES),
  educationalDoc2: fileListSchema("Additional education record", DOCUMENT_TYPES),
  professionalDoc: fileListSchema("Professional document", DOCUMENT_TYPES),
});
