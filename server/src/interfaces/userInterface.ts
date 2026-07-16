import * as Sequelize from "sequelize";

import type { RoleEnum } from "../enums/roleEnum.js";

export interface UserInterface {
  id: number;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  role: RoleEnum;
}

export interface UserModelInterface
  extends
    Sequelize.Model<UserInterface, Partial<UserInterface>>,
    UserInterface {}
