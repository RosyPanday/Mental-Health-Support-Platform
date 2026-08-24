import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input/Input";
import { useAuth } from "../../context/AuthContext";
import type { AuthRoleOption } from "../../interfaces/auth";
import type { AuthRouteState } from "../../interfaces/navigation";
import { getPostAuthDestination } from "../../routes/authNavigation";
import { loginUser } from "../../services/authService";
import type { UserRole } from "../../types/auth";
import type { LoginFormValues } from "../../types/forms";
import { loginSchema } from "../../validation/formSchemas";

const roles: AuthRoleOption<UserRole>[] = [
  { value: "patient", label: "Client", icon: "♡" },
  { value: "therapist", label: "Therapist", icon: "♙" },
  { value: "admin", label: "Admin", icon: "◇" },
];

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const routeState = location.state as AuthRouteState | null;
  const requestedRole = routeState?.role;
  const [loginError, setLoginError] = useState("");
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      role: requestedRole ?? "patient",
      username: "",
      password: "",
    },
  });

  const role = watch("role");
  const roleRegistration = register("role");

  const submitLogin = async (values: LoginFormValues) => {
    setLoginError("");

    try {
      const response = await loginUser(values);

      login(
        {
          ...response.user,
          role: values.role,
        },
        response.token,
      );

      navigate(getPostAuthDestination(values.role, routeState?.from), {
        replace: true,
      });
    } catch (error: any) {
      console.error(error);
      setLoginError(
        error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          "We could not sign you in. Please check your details and try again.",
      );
    }
  };

  const signupRole = role === "therapist" ? "therapist" : "patient";

  return (
    <AuthLayout
      mode="login"
      eyebrow="Your space is ready"
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard and support tools."
      alternateState={{
        role: signupRole,
        from: role === "admin" ? undefined : routeState?.from,
      }}
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit(submitLogin)}
        aria-busy={isSubmitting}
        noValidate
      >
        <fieldset className="auth-fieldset">
          <legend>Sign in as</legend>
          <div className="auth-role-options auth-role-options--three">
            {roles.map((item) => (
              <label className="auth-role-option" key={item.value}>
                <input
                  {...roleRegistration}
                  type="radio"
                  value={item.value}
                  checked={role === item.value}
                  onChange={(event) => {
                    roleRegistration.onChange(event);
                    clearErrors("role");
                    setLoginError("");
                  }}
                />
                <span className="auth-role-option__content">
                  <span className="auth-role-option__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {errors.role?.message && <p className="auth-field__error" role="alert">{errors.role.message}</p>}
        </fieldset>

        <Input
          label="Username"
          placeholder="Enter your username"
          autoComplete="username"
          error={errors.username?.message}
          {...register("username", { onChange: () => setLoginError("") })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { onChange: () => setLoginError("") })}
        />

        {role === "admin" && (
          <span className="auth-field__hint">
            Administrator access is reserved for platform management accounts.
          </span>
        )}

        {loginError && (
          <p className="auth-form-error" role="alert">
            <span aria-hidden="true">!</span>
            {loginError}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting && <span className="auth-submit__spinner" />}
          {isSubmitting ? "Signing you in…" : "Sign in to your account"}
        </button>

        <p className="auth-form-note">
          <LockIcon />
          Your account details are used only to access your personal dashboard.
        </p>
      </form>
    </AuthLayout>
  );
}
