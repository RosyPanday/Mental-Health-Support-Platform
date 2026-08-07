import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";

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
    const input = {
      id: consultationId,
      status: status,
      ...(reason !== undefined && { reason }),
    };
    await this.requestConsultationsRepository.update({
      input,
      where: { id: consultationId },
    });
  }
}
