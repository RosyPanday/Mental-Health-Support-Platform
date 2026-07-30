import * as Sequelize from "sequelize";

import { Database } from "#src/database/connection.js";
import { PHQSeverityEnum } from "#src/enums/screeningEnum.js";
import { type PHQNineModelInterface } from "#src/interfaces/screeningInterface.js";
import Patient from "./patient.js";

const sequelize = Database.sequelize;

const PHQNine = sequelize.define<PHQNineModelInterface>(
  "phq_nine_results",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
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
    responses: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
    },
    totalScore: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "total_score",
    },
    severity: {
      type: Sequelize.ENUM(
        PHQSeverityEnum.none,
        PHQSeverityEnum.mild,
        PHQSeverityEnum.moderate,
        PHQSeverityEnum.moderatelySevere,
        PHQSeverityEnum.severe,
      ),
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

PHQNine.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

Patient.hasMany(PHQNine, {
  foreignKey: "patientId",
  as: "phqNine",
});

export default PHQNine;
