import type { ReactNode } from "react";

import type { AuthMode, PreferredLanguage, SignupRole, UserRole } from "../types/auth";
import type { AuthRouteState } from "./navigation";

export interface User {
  id?: string;
  username: string;
  name?: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface LoginInput {
  username: string;
  password: string;
  role: UserRole;
}

export interface SignupInput {
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  role: SignupRole;
  language: PreferredLanguage;
  age?: number;
  issues?: string;
  yearsOfExperience?: number;
  rate?: number;
  specialization?: string;
  educationDegree?: string;
}

export interface LoginResponse {
  login: {
    message: string;
    data: {
      token: string;
      user: {
        username: string;
      };
    };
  };
}

export interface SignupResponse {
  signup: {
    message: string;
    data: {
      token: string;
      user: {
        id: string;
        username: string;
        name: string;
        phoneNumber: string;
        role: UserRole;
      };
    };
  };
}

export interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthRoleOption<TRole extends UserRole = UserRole> {
  value: TRole;
  label: string;
  icon: string;
  description?: string;
}

export interface AuthLayoutProps {
  mode: AuthMode;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  alternateState?: AuthRouteState;
}
