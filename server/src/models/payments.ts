import * as Sequelize from "sequelize";

import { Database } from "#src/database/connection.js";
import RequestConsultation from "./requestConsultations.js";
import type { PaymentModelInterface } from "#src/interfaces/paymentInterface.js";

const sequelize = Database.sequelize;

const Payments = sequelize.define<PaymentModelInterface>(
  "payments",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    requestConsultationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: RequestConsultation,
        key: "id",
      },
      field: "request_consultation_id",
    },

    provider: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "KHALTI",
    },

    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    status: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "PENDING",
    },

    pidx: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },

    transactionId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "transaction_id",
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

Payments.belongsTo(RequestConsultation, {
  foreignKey: "requestConsultationId",
  as: "requestConsultation",
});

RequestConsultation.hasOne(Payments, {
  foreignKey: "requestConsultationId",
  as: "payment",
});

export default Payments;
