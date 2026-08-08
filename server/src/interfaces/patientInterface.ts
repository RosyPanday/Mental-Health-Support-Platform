import * as Sequelize from "sequelize";
import type { TherapistInterface } from "./therapistInterface.js";

export interface PatientInterface {
  id: number;
  userId: number;
  name: string;
  language: string;
}

export interface therapistRecommendationInterface {
  recommendedTherapists: TherapistInterface[];
}

export interface PatientModelInterface
  extends
    Sequelize.Model<PatientInterface, Partial<PatientInterface>>,
    PatientInterface {}
