import * as Sequelize from "sequelize";

export interface TherapistInterface {
  id: number;
  userId: number;
  name: string;
  educationDegree?: string | undefined;
  specialization?: string | undefined;
  yearsOfExperience?: number | undefined;
  language: string;
  review: number;
  completedAppointments: number;
  profilePic?: string | undefined;
  educationalDoc1?: string | undefined;
  educationalDoc2?: string | undefined;
  professionalDoc?: string | undefined;
  rate?: number;
  isVerified: boolean;
}

export interface TherapistUploadFields {
  profilePic?: Express.Multer.File[];
  educationalDoc1?: Express.Multer.File[];
  educationalDoc2?: Express.Multer.File[];
  professionalDoc?: Express.Multer.File[];
}

export interface TherapistModelInterface
  extends
    Sequelize.Model<TherapistInterface, Partial<TherapistInterface>>,
    TherapistInterface {}
