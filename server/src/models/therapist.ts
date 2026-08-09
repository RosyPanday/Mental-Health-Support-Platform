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
    rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    profilePic: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "profile_pic",
    },
    educationalDoc1: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "educational_doc1",
    },
    educationalDoc2: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "educational_doc2",
    },
    professionalDoc: {
      type: Sequelize.STRING,
      allowNull: true,
      field: "professional_doc",
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
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
