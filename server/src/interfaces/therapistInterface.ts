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
}

export interface TherapistModelInterface
  extends
    Sequelize.Model<TherapistInterface, Partial<TherapistInterface>>,
    TherapistInterface {}
