import * as Sequelize from "sequelize";

import { Database } from "#src/database/connection.js";
import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import type { RequestConsultationModelInterface } from "#src/interfaces/index.js";
import Patient from "./patient.js";
import Therapist from "./therapist.js";

const sequelize = Database.sequelize;

const RequestConsultation = sequelize.define<RequestConsultationModelInterface>(
  "request_consultations",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Patient,
        key: "id",
      },
      field: "patient_id",
    },
    therapistId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Therapist,
        key: "id",
      },
      field: "therapist_id",
    },
    preferredTime: {
      type: Sequelize.DATE,
      allowNull: false,
      field: "preferred_time",
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM(...Object.values(RequestConsultationStatusEnum)),
      allowNull: false,
      defaultValue: RequestConsultationStatusEnum.pending,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

RequestConsultation.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(RequestConsultation, {
  foreignKey: "patientId",
  as: "requestConsultations",
});

RequestConsultation.belongsTo(Therapist, {
  foreignKey: "therapistId",
  as: "therapist",
});

Therapist.hasMany(RequestConsultation, {
  foreignKey: "therapistId",
  as: "requestConsultations",
});

export default RequestConsultation;
