export type UserRole = "patient" | "therapist" | "admin";
export type SignupRole = Exclude<UserRole, "admin">;
export type AuthMode = "login" | "signup";
export type PreferredLanguage = "nepali" | "english";
