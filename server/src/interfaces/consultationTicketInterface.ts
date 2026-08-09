import * as Sequelize from "sequelize";

export interface ConsultationTicketInterface {
  id: number;
  patientId: number;
  therapistId: number;
  amount: number;
  status: string;
  pidx: string | null;
  transactionId: string | null;
  orderId: string;
}

export interface ConsultationTicketModelInterface
  extends Sequelize.Model<ConsultationTicketInterface, Partial<ConsultationTicketInterface>>,
    ConsultationTicketInterface {}
