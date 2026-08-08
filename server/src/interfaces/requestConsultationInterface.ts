import * as Sequelize from "sequelize";

import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import type { PatientInterface } from "./patientInterface.js";
import type { TherapistInterface } from "./therapistInterface.js";
import type { CallStatusEnum } from "#src/enums/callStatusEnum.js";

export interface RequestConsultationInterface {
  id: number;
  patientId: number;
  therapistId: number;
  preferredTime: Date;
  reason:string;
  status: RequestConsultationStatusEnum;
  callStatus:CallStatusEnum;
  roomName:String;
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
