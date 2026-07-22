import * as Sequelize from "sequelize";

import { Database } from "#src/database/connection.js";
import type { TherapistModelInterface } from "#src/interfaces/therapistInterface.js";
import User from "./user.js";

const sequelize = Database.sequelize;
const Therapist = sequelize.define<TherapistModelInterface>(
  "therapists",
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
      references: {
        model: User,
        key: "id",
      },
      field: "user_id",
    },
    name: {
      type: Sequelize.STRING(40),
      allowNull: false,
    },
    educationDegree: {
      type: Sequelize.STRING(40),
      allowNull: false,
      field: "education_degree",
    },
    specialization: {
      type: Sequelize.STRING,
    },
    yearsOfExperience: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "years_of_experience",
    },
    language: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    review: {
      type: Sequelize.DECIMAL(3, 2),
      defaultValue: 0,
    },
    completedAppointments: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      field: "completed_appointments",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

Therapist.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(Therapist, {
  foreignKey: "userId",
  as: "therapist",
});
export default Therapist;
