import Sequelize from "sequelize";

export interface ScreeningInterface {
  responses: number[];
}

export interface PHQNineInterface {
  id: number;
  userId: number;
  patientId: number;
  responses: number[];
  totalScore: number;
  severity: string;
}

export interface PHQNineModelInterface
  extends
    Sequelize.Model<PHQNineInterface, Partial<PHQNineInterface>>,
    PHQNineInterface {}
