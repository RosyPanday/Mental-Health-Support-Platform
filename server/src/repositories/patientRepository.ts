import type { InputSignupInterface } from "#src/interfaces/authInterface.js";
import { BaseRepository } from "./baseRepository.js";
import Model from "#src/models/index.js";

export class PatientRepository extends BaseRepository<
  InputSignupInterface,
  InputSignupInterface
> {
  constructor() {
    super(Model.Patient);
  }
}
