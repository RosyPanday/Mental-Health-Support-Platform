import crypto from "crypto";

import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";
import { CallStatusEnum } from "#src/enums/callStatusEnum.js";

export class TherapistService {
  private requestConsultationsRepository: RequestConsultationRepository;

  constructor() {
    this.requestConsultationsRepository = new RequestConsultationRepository();
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
}
