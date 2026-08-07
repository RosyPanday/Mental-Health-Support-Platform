import * as Sequelize from "sequelize";

import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";

export interface RequestConsultationInterface {
  id: number;
  patientId: number;
  therapistId: number;
  preferredTime: Date;
  status: RequestConsultationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RequestConsultationModelInterface
  extends
    Sequelize.Model<
      RequestConsultationInterface,
      Partial<RequestConsultationInterface>
    >,
    RequestConsultationInterface {}
