import { TherapistRepository } from "#src/repositories/index.js";

export class UploadService {
  private therapistRepository: TherapistRepository;

  constructor() {
    this.therapistRepository = new TherapistRepository();
  }

  public async uploadTherapistDocumentsAndImage(
    therapistId: number,
    profilePic: string,
    educationalDoc1: string,
    educationalDoc2: string,
    professionalDoc: string,
  ) :Promise<void>{
    await this.therapistRepository.updateTherapistDocumentsAndImage(
      therapistId,
      profilePic,
      educationalDoc1,
      educationalDoc2,
      professionalDoc,
    );
  }
}
