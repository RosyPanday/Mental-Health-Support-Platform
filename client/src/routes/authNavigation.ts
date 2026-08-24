import type { UserRole } from "../types/auth";

const defaultDestinations: Record<UserRole, string> = {
  patient: "/patient-dashboard",
  therapist: "/therapist-dashboard",
  admin: "/admin-dashboard",
};

const permittedDestinations: Record<UserRole, Set<string>> = {
  patient: new Set([
    "/patient-dashboard",
    "/depression-screening",
    "/book-consultation",
    "/pending-consultations",
    "/confirmed-consultations",
    "/cancelled-consultations",
    "/khalti-verification",
  ]),
  therapist: new Set([
    "/therapist-dashboard",
    "/therapist-documents",
    "/therapist-pending",
    "/therapist-confirmed",
    "/therapist-cancelled",
  ]),
  admin: new Set(["/admin-dashboard"]),
};

export function getPostAuthDestination(role: UserRole, requestedPath?: string) {
  if (requestedPath && permittedDestinations[role].has(requestedPath)) {
    return requestedPath;
  }

  return defaultDestinations[role];
}
