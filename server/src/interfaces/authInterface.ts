import type { RoleEnum } from "@src/enums/roleEnum.js";

export interface InputSignupInterface {
  id?: number;
  userId?: number | undefined;
  username: string;
  phoneNumber: string;
  role: RoleEnum;
  password: string;
  email: string;
  name: string;
  language: string;
  educationDegree?: string | undefined;
  specialization?: string | undefined;
  yearsOfExperience?: string | undefined;
  profilePic?: string;
  educationalDoc1?: string;
  educationalDoc2?: string;
  professionalDoc?: string;
  isVerified?: boolean;
  verified: boolean;
  createdAt?: Date;
  upadtedAt?: Date;
  deletedAt?: Date;
  // confirmPassword: string;
}

export interface InputLoginInterface {
  username: string;
  password: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}
export interface SignupLoginResponseInterface {
  token: string;
  user: User;
}
