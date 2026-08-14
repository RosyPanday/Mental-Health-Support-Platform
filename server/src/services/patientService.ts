import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { PatientRepository } from "#src/repositories/patientRepository.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";
import { Op } from "sequelize";

export class PatientService {
  private patientRepository: PatientRepository;
  private requestConsultationsRepository: RequestConsultationRepository;

  constructor() {
    this.patientRepository = new PatientRepository();
    this.requestConsultationsRepository = new RequestConsultationRepository();
  }

  public requestConsultation = async ({
    patientId,
    therapistId,
    preferredTime,
  }: {
    patientId: number;
    therapistId: number;
    preferredTime: Date;
  }): Promise<void> => {
    const previousConsultations =
      await this.requestConsultationsRepository.findOne({
        where: {
          patientId: patientId,
          status: [
            RequestConsultationStatusEnum.pending,
            RequestConsultationStatusEnum.confirmed,
          ],
        },
        raw: true,
      });
    const newTimeMs = new Date(preferredTime).getTime();

    const ONE_HOUR_MS = 60 * 60 * 1000;
    if (previousConsultations) {
      const prevTimeMs = new Date(
        previousConsultations.preferredTime,
      ).getTime();

      if (Math.abs(prevTimeMs - newTimeMs) < ONE_HOUR_MS) {
        throw new Error(
          "You cannot request a consultaion within one hour of your already pending/confirmed consultations",
        );
      }
    }

    await this.requestConsultationsRepository.create({
      patientId: patientId,
      therapistId,
      preferredTime,
    });
  };
}
