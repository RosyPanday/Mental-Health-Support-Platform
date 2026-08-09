import { BaseRepository } from "./baseRepository.js";
import Model from "#src/models/index.js";
import type {
  InputSignupInterface,
  TherapistInterface,
} from "#src/interfaces/index.js";

export class TherapistRepository extends BaseRepository<
  InputSignupInterface,
  TherapistInterface
> {
  constructor() {
    super(Model.Therapist);
  }

  public async getTherapistIdFromUserId(
    userId: number,
  ): Promise<{ id: number } | null> {
    return await this.findOne({
      where: {
        userId: userId,
      },
      attributes: ["id"],
      raw: true,
    });
  }

  public async updateTherapistDocumentsAndImage(
    therapistId: number,
    profilePic: string,
    educationalDoc1: string,
    educationalDoc2: string,
    professionalDoc: string,
  ): Promise<void> {
    await this.updateOne({
      id: therapistId,
      input: {
        profilePic,
        educationalDoc1,
        educationalDoc2,
        professionalDoc,
        isVerified: true,
      },
    });
  }
}
