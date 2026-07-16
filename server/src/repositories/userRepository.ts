import type { InputSignupInterface } from "#src/interfaces/authInterface.js";
import { BaseRepository } from "./baseRepository.js";
import Model from "@src/models/index.js";
import type { UserModelInterface } from "#src/interfaces/userInterface.js";

export class UserRepository extends BaseRepository<
  InputSignupInterface,
  UserModelInterface
> {
  constructor() {
    super(Model.User);
  }
  public async findByEmail(email: string): Promise<UserModelInterface> {
    return this.findOne({
      where: { email: email },
    });
  }
  public async findByUsername(username: string): Promise<UserModelInterface> {
    return this.findOne({
      where: { username: username },
    });
  }
  public async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserModelInterface> {
    return this.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }
}
