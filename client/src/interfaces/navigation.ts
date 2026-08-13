import type { ReactNode } from "react";

import type { UserRole } from "../types/auth";

export interface AuthRouteState {
  role?: UserRole;
  from?: string;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: UserRole;
}
