import { PatientRepository } from "#src/repositories/patientRepository.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";

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
    await this.requestConsultationsRepository.create({
      patientId: patientId,
      therapistId,
      preferredTime,
    });
  };
}
