import Sequelize from "sequelize";

export interface ScreeningInterface {
  responses: number[];
}

export interface PHQNineScreeningReponseInterface {
  totalScore:number;
  severity:string;
}

export interface PHQNineInterface {
  id: number;
  patientId: number;
  responses: number[];
  totalScore: number;
  severity: string;
}

export interface PHQNineModelInterface
  extends
    Sequelize.Model<PHQNineInterface, Partial<PHQNineInterface>>,
    PHQNineInterface {}
