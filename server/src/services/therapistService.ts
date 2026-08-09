import crypto from "crypto";

import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";
import { CallStatusEnum } from "#src/enums/callStatusEnum.js";
import type { TherapistInterface } from "#src/interfaces/index.js";
import { TherapistRepository } from "#src/repositories/therapistRepository.js";
import Model from "#src/models/index.js";
import { Op } from "sequelize";

export class TherapistService {
  private requestConsultationsRepository: RequestConsultationRepository;
  private therapistRepository: TherapistRepository;

  constructor() {
    this.requestConsultationsRepository = new RequestConsultationRepository();
    this.therapistRepository = new TherapistRepository();
  }

  public async confirmOrCancelBooking({
    consultationId,
    status,
    reason,
  }: {
    consultationId: number;
    status: RequestConsultationStatusEnum;
    reason: string | undefined;
  }): Promise<void> {
    const isConfirmed = status === RequestConsultationStatusEnum.confirmed;
    const input = {
      id: consultationId,
      status: status,
      ...(reason !== undefined && { reason }),
      ...(isConfirmed && {
        roomName: `therapy-session-room-${crypto.randomUUID()}`,
        callStatus: CallStatusEnum.scheduled,
      }),
    };
    await this.requestConsultationsRepository.update({
      input,
      where: { id: consultationId },
    });
  }

  //admin usage on therapists
  public async getUnverifiedTherapists(): Promise<TherapistInterface[]> {
    const unverifiedTherapists = await this.therapistRepository.findAll({
      where: {
        isVerified: false,
        profilePic: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Model.User,
          as: "user",
          attributes: ["email", "phoneNumber"],
        },
      ],
      raw: true,
      nest: true,
    });

    return unverifiedTherapists;
  }

  public async verifyTherapist(therapistId: number): Promise<void> {
    const existingTherapist = this.therapistRepository.findByPk(therapistId);
    if (!existingTherapist) {
      throw new Error("Therapist doesn't exist in database");
    }
    await this.therapistRepository.update({
      input: { isVerified: true },
      where: { id: therapistId },
    });
  }
}
