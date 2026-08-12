import * as Sequelize from "sequelize";

import { Database } from "#src/database/connection.js";
import type { PatientModelInterface } from "#src/interfaces/patientInterface.js";
import User from "./user.js";

const sequelize = Database.sequelize;
const Patient = sequelize.define<PatientModelInterface>(
  "patients",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references:{
        model: User,
        key:'id'
      },
      field: "user_id",
    },
    name: {
      type: Sequelize.STRING(40),
      allowNull: false,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    issues: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    language: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

Patient.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(Patient, {
  foreignKey: "userId",
  as: "patient",
});

export default Patient;
