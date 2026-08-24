import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../interfaces/navigation";

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, role: allowedRole }}
      />
    );
  }

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    if (user.role === "patient") {
      return (
        <Navigate
          to="/patient-dashboard"
          replace
        />
      );
    }

    if (user.role === "therapist") {
      return (
        <Navigate
          to="/therapist-dashboard"
          replace
        />
      );
    }

    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin-dashboard"
          replace
        />
      );
    }
  }

  return <>{children}</>;
}
