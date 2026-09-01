import * as Sequelize from "sequelize";
import type { TherapistInterface } from "./therapistInterface.js";

export interface PatientInterface {
  id: number;
  userId: number;
  name: string;
  age: number;
  issues?: string;
  language: string;
}

export interface therapistRecommendationInterface {
  recommendedTherapists: Array<{
    therapist: TherapistInterface;
    similarityPercentage: number;
  }> | null;
}

export interface PatientModelInterface
  extends
    Sequelize.Model<PatientInterface, Partial<PatientInterface>>,
    PatientInterface {}
