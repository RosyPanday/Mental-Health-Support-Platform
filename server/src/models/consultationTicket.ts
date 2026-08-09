import * as Sequelize from "sequelize";
import { Database } from "#src/database/connection.js";
import type { ConsultationTicketModelInterface } from "#src/interfaces/consultationTicketInterface.js";
import Patient from "./patient.js";
import Therapist from "./therapist.js";

const ConsultationTicket = Database.sequelize.define<ConsultationTicketModelInterface>("consultation_tickets", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: Sequelize.INTEGER, allowNull: false, field: "patient_id", references: { model: Patient, key: "id" } },
  therapistId: { type: Sequelize.INTEGER, allowNull: false, field: "therapist_id", references: { model: Therapist, key: "id" } },
  amount: { type: Sequelize.INTEGER, allowNull: false },
  status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "INITIATED" },
  pidx: { type: Sequelize.STRING, allowNull: true, unique: true },
  transactionId: { type: Sequelize.STRING, allowNull: true, field: "transaction_id" },
  orderId: { type: Sequelize.STRING, allowNull: false, unique: true, field: "order_id" },
}, { timestamps: true, paranoid: true, underscored: true });

export default ConsultationTicket;
