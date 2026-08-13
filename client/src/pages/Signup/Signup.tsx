import { yupResolver } from "@hookform/resolvers/yup";
import { useState, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input/Input";
import { useAuth } from "../../context/AuthContext";
import type { AuthRoleOption, SignupInput } from "../../interfaces/auth";
import type { AuthRouteState } from "../../interfaces/navigation";
import { getPostAuthDestination } from "../../routes/authNavigation";
import { signupUser } from "../../services/authService";
import type { SignupRole } from "../../types/auth";
import type { SignupFormValues } from "../../types/forms";
import { signupSchema } from "../../validation/formSchemas";

function allowOnlyNumberKeys(event: KeyboardEvent<HTMLInputElement>) {
  if (event.ctrlKey || event.metaKey || event.key.length > 1) return;

  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

const roles: AuthRoleOption<SignupRole>[] = [
  {
    value: "patient",
    label: "I am looking for support",
    description: "Create a client account",
    icon: "♡",
  },
  {
    value: "therapist",
    label: "I provide mental health care",
    description: "Create a therapist account",
    icon: "♙",
  },
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

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const routeState = location.state as AuthRouteState | null;
  const requestedRole = routeState?.role;
  const [serverError, setServerError] = useState("");
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      role: requestedRole === "therapist" ? "therapist" : "patient",
      name: "",
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      language: "nepali",
      age: "",
      issues: "",
      yearsOfExperience: "",
      rate: "",
      specialization: "",
      educationDegree: "",
    },
  });

  const role = watch("role");
  const roleRegistration = register("role");

  const submitSignup = async (values: SignupFormValues) => {
    setServerError("");

    const input: SignupInput = {
      name: values.name,
      username: values.username,
      password: values.password,
      email: values.email,
      phoneNumber: values.phoneNumber,
      language: values.language,
      role: values.role,
    };

    if (values.role === "patient") {
      input.age = Number(values.age);
      if (values.issues?.trim()) {
        input.issues = values.issues.trim();
      }
    }

    if (values.role === "therapist") {
      input.yearsOfExperience = Number(values.yearsOfExperience);
      input.rate = Number(values.rate);
      input.specialization = values.specialization;
      input.educationDegree = values.educationDegree;
    }

    try {
      const response = await signupUser(input);

      login(
        {
          ...response.user,
          role: values.role,
        },
        response.token,
      );

      navigate(getPostAuthDestination(values.role, routeState?.from), { replace: true });
    } catch (error: any) {
      console.error(error);
      setServerError(
        error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          "We could not create your account. Please review your details and try again.",
      );
    }
  };

  const clearServerError = () => setServerError("");

  return (
    <AuthLayout
      mode="signup"
      eyebrow="Create your personal space"
      title="Start your journey"
      subtitle="Tell us a little about yourself so we can shape the right experience for you."
      alternateState={{ role, from: routeState?.from }}
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit(submitSignup)}
        aria-busy={isSubmitting}
        noValidate
      >
        <fieldset className="auth-fieldset">
          <legend>How will you use the platform?</legend>
          <div className="auth-role-options">
            {roles.map((item) => (
              <label className="auth-role-option" key={item.value}>
                <input
                  {...roleRegistration}
                  type="radio"
                  value={item.value}
                  checked={role === item.value}
                  onChange={(event) => {
                    roleRegistration.onChange(event);
                    clearErrors(["role", "age", "issues", "yearsOfExperience", "rate", "specialization", "educationDegree"]);
                    clearServerError();
                  }}
                />
                <span className="auth-role-option__content auth-role-option__content--described">
                  <span className="auth-role-option__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                </span>
              </label>
            ))}
          </div>
          {errors.role?.message && <p className="auth-field__error" role="alert">{errors.role.message}</p>}
        </fieldset>

        <div className="auth-section-divider">Account details</div>

        <div className="auth-form-grid">
          <Input label="Full name" placeholder="Your full name" autoComplete="name" error={errors.name?.message} {...register("name", { onChange: clearServerError })} />
          <Input label="Username" placeholder="Choose a username" autoComplete="username" error={errors.username?.message} {...register("username", { onChange: clearServerError })} />
          <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} {...register("email", { onChange: clearServerError })} />
          <Input label="Phone number" type="tel" placeholder="Your phone number" autoComplete="tel" error={errors.phoneNumber?.message} {...register("phoneNumber", { onChange: clearServerError })} />
          <Input label="Password" type="password" placeholder="Create a password" autoComplete="new-password" error={errors.password?.message} {...register("password", { onChange: clearServerError })} />

          <div className={`auth-field${errors.language ? " auth-field--invalid" : ""}`}>
            <label htmlFor="signup-language">Preferred language</label>
            <select
              id="signup-language"
              aria-invalid={errors.language ? "true" : undefined}
              aria-describedby={errors.language ? "signup-language-error" : undefined}
              {...register("language", { onChange: clearServerError })}
            >
              <option value="nepali">Nepali</option>
              <option value="english">English</option>
            </select>
            {errors.language?.message && <p className="auth-field__error" id="signup-language-error" role="alert">{errors.language.message}</p>}
          </div>
        </div>

        {role === "patient" && (
          <>
            <div className="auth-section-divider">Support details</div>
            <p className="auth-field__hint">
              Tell us a little about your age and any support needs you would like to share.
            </p>

            <div className="auth-form-grid">
              <Input label="Age" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} placeholder="Your age" onKeyDown={allowOnlyNumberKeys} error={errors.age?.message} {...register("age", { onChange: clearServerError })} />
              <div className="auth-form-grid__full">
                <div className={`auth-field${errors.issues ? " auth-field--invalid" : ""}`}>
                  <label htmlFor="signup-issues">Do you have any concerns or issues?</label>
                  <textarea
                    id="signup-issues"
                    rows={4}
                    placeholder="Optional: share what you would like support with"
                    aria-invalid={errors.issues ? "true" : undefined}
                    aria-describedby={errors.issues ? "signup-issues-error" : undefined}
                    {...register("issues", { onChange: clearServerError })}
                  />
                  {errors.issues?.message && <p className="auth-field__error" id="signup-issues-error" role="alert">{errors.issues.message}</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {role === "therapist" && (
          <>
            <div className="auth-section-divider">Professional details</div>
            <p className="auth-field__hint">
              These details help begin the therapist verification process. You can
              upload supporting documents from your dashboard after signup.
            </p>

            <div className="auth-form-grid">
              <Input label="Years of experience" type="number" min="1" max="40" step="1" inputMode="numeric" placeholder="For example, 5" error={errors.yearsOfExperience?.message} {...register("yearsOfExperience", { onChange: clearServerError })} />
              <Input label="Session rate (Rs.)" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="For example, 1500" onKeyDown={allowOnlyNumberKeys} error={errors.rate?.message} {...register("rate", { onChange: clearServerError })} />
              <Input label="Specialization" placeholder="For example, anxiety" error={errors.specialization?.message} {...register("specialization", { onChange: clearServerError })} />
              <div className="auth-form-grid__full">
                <Input label="Education degree" placeholder="Your highest relevant degree" error={errors.educationDegree?.message} {...register("educationDegree", { onChange: clearServerError })} />
              </div>
            </div>
          </>
        )}

        {serverError && (
          <p className="auth-form-error" role="alert">
            <span aria-hidden="true">!</span>
            {serverError}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting && <span className="auth-submit__spinner" />}
          {isSubmitting ? "Creating your account…" : "Create my account"}
        </button>

        <p className="auth-form-note">
          <LockIcon />
          Your account information is used to provide your platform experience.
        </p>
      </form>
    </AuthLayout>
  );
}
