import * as Sequelize from "sequelize";

export interface PaymentInterface {
  id: number;
  requestConsultationId: number;
  provider: "KHALTI";
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  pidx: string | null;
  transactionId: string | null;
}

export interface RequestConsultationWithTherapist {
  id: number;
  patientId: number;
  therapistId: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  therapist: {
    rate: number;
    name: string;
  } | null;
}

export interface PaymentModelInterface
  extends
    Sequelize.Model<PaymentInterface, Partial<PaymentInterface>>,
    PaymentInterface {}
