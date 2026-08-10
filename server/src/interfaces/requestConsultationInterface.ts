import * as Sequelize from "sequelize";

import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import type { PatientInterface, UserInterface } from "./index.js";
import type { TherapistInterface } from "./therapistInterface.js";
import type { CallStatusEnum } from "#src/enums/callStatusEnum.js";
import type { PaymentStatusEnum } from "#src/enums/paymentStatusEnum.js";

export interface RequestConsultationInterface {
  id: number;
  patientId: number;
  therapistId: number;
  preferredTime: Date;
  reason: string;
  status: RequestConsultationStatusEnum;
  callStatus: CallStatusEnum;
  roomName: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  patient?: Pick<PatientInterface, "id" | "name" | "language"> & {
    user?: Pick<UserInterface, "email" | "phoneNumber">;
  };
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
    | "rate"
  > & {
    user?: Pick<UserInterface, "email" | "phoneNumber">;
  };
  payment?: {
    status: PaymentStatusEnum | string;
  };
}

export interface RequestConsultationModelInterface
  extends
    Sequelize.Model<
      RequestConsultationInterface,
      Partial<RequestConsultationInterface>
    >,
    RequestConsultationInterface {}
