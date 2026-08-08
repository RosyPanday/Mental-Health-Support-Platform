import { CallStatusEnum } from "#src/enums/callStatusEnum.js";
import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";

export class VideoCallService {
  private requestConsultationRepository: RequestConsultationRepository;

  constructor() {
    this.requestConsultationRepository = new RequestConsultationRepository();
  }

  public async joinVideoCall(
    consultationId: number,
  ): Promise<{ meetingLink: string }> {
    const consultation =
      await this.requestConsultationRepository.findByPk(consultationId);
    if (
      !consultation ||
      consultation.status !== RequestConsultationStatusEnum.confirmed
    ) {
      throw new Error("This consultation hasnt been confirmed");
    }
    const preferredTimeMs = new Date(consultation.preferredTime).getTime();
    const nowMs = Date.now();
    if (preferredTimeMs > nowMs) {
      throw new Error("It is not time for your consultation yet.");
    }
    const input: { callStatus: CallStatusEnum; roomName?: string } = {
      callStatus: CallStatusEnum.ongoing,
    };
    let roomName: string | null = consultation.roomName
      ? consultation.roomName.toString()
      : null;
    if (!roomName) {
      roomName = `therapy-session-room-${crypto.randomUUID()}`;
      input.roomName = roomName;
    }
    await this.requestConsultationRepository.update({
      where: {
        id: consultationId,
      },
      input,
    });
    const domain = "meet.jit.si";
    return {
      meetingLink: `https://${domain}/${roomName}`,
    };
  }
}
