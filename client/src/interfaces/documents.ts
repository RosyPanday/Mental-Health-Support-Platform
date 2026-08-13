import type { UseFormRegisterReturn } from "react-hook-form";

export interface FileBoxProps {
  accept: string;
  acceptedFormats: string;
  description: string;
  error?: string;
  file: File | null;
  id: string;
  index: string;
  registration: UseFormRegisterReturn;
  title: string;
}
