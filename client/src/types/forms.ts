import type { InferType } from "yup";

import type {
  cancellationSchema,
  consultationTimeSchema,
  loginSchema,
  screeningSchema,
  signupSchema,
  therapistDocumentsSchema,
  therapistSearchSchema,
} from "../validation/formSchemas";

export type LoginFormValues = InferType<typeof loginSchema>;
export type SignupFormValues = InferType<typeof signupSchema>;
export type TherapistSearchFormValues = InferType<typeof therapistSearchSchema>;
export type ConsultationTimeFormValues = InferType<typeof consultationTimeSchema>;
export type CancellationFormValues = InferType<typeof cancellationSchema>;
export type ScreeningFormValues = InferType<typeof screeningSchema>;
export type TherapistDocumentsFormValues = InferType<typeof therapistDocumentsSchema>;
