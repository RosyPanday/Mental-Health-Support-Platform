import { CallStatusEnum } from "#src/enums/callStatusEnum.js";
import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { PaymentRepository } from "#src/repositories/paymentRepository.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";

export class VideoCallService {
  private requestConsultationRepository: RequestConsultationRepository;
  private paymentRepository: PaymentRepository;

  constructor() {
    this.requestConsultationRepository = new RequestConsultationRepository();
    this.paymentRepository = new PaymentRepository();
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

    //check for payment
    const payment = await this.paymentRepository.findOne({
      where: {
        requestConsultationId: consultationId,
      },
      raw: true,
    });

    if (payment) {
      if (payment.status !== "PAID") {
        throw new Error(
          "You cannot join the sesson without first paying for the session.",
        );
      }
    }
   
    if(!payment){
      throw new Error("You can not join this session without first paying for it.");
    }
    //checking time
    const preferredTimeMs = new Date(consultation.preferredTime).getTime();
    const nowMs = Date.now();
    const ONE_HOUR_MS = 60 * 60 * 1000;
    if (preferredTimeMs > nowMs) {
      throw new Error("It is not time for your consultation yet.");
    }
    if (nowMs > preferredTimeMs + ONE_HOUR_MS) {
      throw new Error("Your consultation window has expired.");
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
