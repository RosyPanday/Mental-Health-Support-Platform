import * as Sequelize from "sequelize";

export interface PatientInterface {
  id: number;
  userId: number;
  name: string;
  language: string;
}

export interface PatientModelInterface
  extends
    Sequelize.Model<PatientInterface, Partial<PatientInterface>>,
    PatientInterface {}
