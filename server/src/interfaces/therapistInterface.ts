import * as Sequelize from "sequelize";

export interface TherapistInterface {
  id: number;
  userId: number;
  name: string;
  educationDegree: string;
  specialization: string;
  yearsOfExperience: number;
  language: string;
  review: number;
  completedAppointments: number;
  profilePic: string;
  educationalDoc1: string;
  educationalDoc2: string;
  professionalDoc: string;
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
