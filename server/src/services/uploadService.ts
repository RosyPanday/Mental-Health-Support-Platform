import { TherapistRepository } from "#src/repositories/index.js";

export class UploadService {
  private therapistRepository: TherapistRepository;

  constructor() {
    this.therapistRepository = new TherapistRepository();
  }

  formatFileUrl = (filePath: string): string => {
    const normalizedPath = filePath.replace(/\\/g, "/");

    return normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`;
  };

  public async uploadTherapistDocumentsAndImage(
    therapistId: number,
    profilePic: string,
    educationalDoc1: string,
    educationalDoc2: string,
    professionalDoc: string,
  ): Promise<void> {
    //checking just one document just to find out if theyve already uploaded the document once before
    const existingTherapist = await this.therapistRepository.findOne({
      where: {
        id: therapistId,
      },
      attributes: ["profilePic"],
      raw: true,
    });
    if (existingTherapist.profilePic) {
      throw new Error(" You cannot upload your documents multiple times");
    }
    await this.therapistRepository.updateTherapistDocumentsAndImage(
      therapistId,
      this.formatFileUrl(profilePic),
      this.formatFileUrl(educationalDoc1),
      this.formatFileUrl(educationalDoc2),
      this.formatFileUrl(professionalDoc),
    );
  }
}
