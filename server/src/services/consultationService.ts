import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RoleEnum } from "#src/enums/roleEnum.js";
import type { RequestConsultationInterface } from "#src/interfaces/requestConsultationInterface.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";
import Model from "#src/models/index.js";
import { Guard } from "#src/utils/guard.js";

export class ConsultationService {
  private requestConsultationRepository: RequestConsultationRepository;

  constructor() {
    this.requestConsultationRepository = new RequestConsultationRepository();
  }
  async viewConsultations(params: {
    userId: number;
    role: RoleEnum;
    status: RequestConsultationStatusEnum;
  }): Promise<RequestConsultationInterface[]> {
    const { userId, role, status } = params;

    const isPatient = role === RoleEnum.patient;
    const profileId = isPatient
      ? await Guard.grantPatient(userId)
      : await Guard.grantTherapist(userId);

    return await this.requestConsultationRepository.findAll({
      where: {
        ...(isPatient ? { patientId: profileId } : { therapistId: profileId }),
        status,
      },
      include: [
        isPatient
          ? {
              model: Model.Therapist,
              as: "therapist",
              attributes: [
                "id",
                "name",
                "educationDegree",
                "specialization",
                "yearsOfExperience",
                "language",
                "review",
                "rate",
                "profilePic",
                "isVerified",
              ],
              include: [
                {
                  model: Model.User,
                  as: "user",
                  attributes: ["email", "phoneNumber"],
                },
              ],
            }
          : {
              model: Model.Patient,
              as: "patient",
              attributes: ["id", "name", "language"],
              include: [
                {
                  model: Model.User,
                  as: "user",
                  attributes: ["email", "phoneNumber"],
                },
              ],
            },
      ],
      raw:true,
      nest:true
    });
  }
}