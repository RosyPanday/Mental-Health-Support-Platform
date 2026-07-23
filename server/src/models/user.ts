import * as Sequelize from "sequelize";

import { Database } from "#src/database/connection.js";
import { RoleEnum } from "#src/enums/roleEnum.js";
import type { UserModelInterface } from "#src/interfaces/userInterface.js";

const sequelize = Database.sequelize;
const User = sequelize.define<UserModelInterface>(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
      field: "phone_number",
    },
    email: {
      type: Sequelize.STRING(30),
      unique: true,
    },
    role: {
      type: Sequelize.ENUM(RoleEnum.patient, RoleEnum.therapist),
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

export default User;