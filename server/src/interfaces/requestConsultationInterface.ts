import * as Sequelize from "sequelize";

import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import type { PatientInterface } from "./patientInterface.js";
import type { TherapistInterface } from "./therapistInterface.js";

export interface RequestConsultationInterface {
  id: number;
  patientId: number;
  therapistId: number;
  preferredTime: Date;
  reason:string;
  status: RequestConsultationStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  patient?: Pick<PatientInterface, "id" | "name" | "language">;
  therapist?: Pick<
    TherapistInterface,
    | "id"
    | "name"
    | "educationDegree"
    | "specialization"
    | "yearsOfExperience"
    | "language"
    | "review"
    | "profilePic"
    | "isVerified"
  >;
}

export interface RequestConsultationModelInterface
  extends
    Sequelize.Model<
      RequestConsultationInterface,
      Partial<RequestConsultationInterface>
    >,
    RequestConsultationInterface {}
