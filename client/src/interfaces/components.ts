import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

import type { ButtonType, NavbarVariant } from "../types/components";

export interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: ButtonType;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export interface NavItem {
  name: string;
  path: string;
}

export interface NavbarProps {
  type?: NavbarVariant;
}

export interface QuoteProps {
  text: string;
}

export interface UploadCardProps {
  title: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface ShellProps {
  children: ReactNode;
}

export interface IconProps<TName extends string> {
  name: TName;
}
