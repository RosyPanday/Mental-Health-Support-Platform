import { BaseRepository } from "./baseRepository.js";
import Model from "#src/models/index.js";
import type { InputSignupInterface, PatientInterface } from "#src/interfaces/index.js";

export class PatientRepository extends BaseRepository<
  InputSignupInterface,
  PatientInterface
> {
  constructor() {
    super(Model.Patient);
  }
  public async getPatientIdFromUserId(userId: number):Promise<{id:number}|null> {
    return await this.findOne({
      where: {
        userId: userId,
      },
      attributes: ["id"],
      raw:true
    });
  }
}
