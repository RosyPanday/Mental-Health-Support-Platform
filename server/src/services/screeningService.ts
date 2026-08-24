import { PHQNineRepository } from "#src/repositories/phqNineRepository.js";
import { getPHQNineSeverity } from "#src/utils/phqNineSeverity.js";

export class ScreeningService {
  private phqNineRepository: PHQNineRepository;
  constructor() {
    this.phqNineRepository = new PHQNineRepository();
  }

  public insertResponses = async ({
    responses,
    patientId
  }: {
    responses: Array<number>;
    patientId: number;
  }): Promise<{ totalScore: number; severity: string; message: string }> => {
    const totalScore = responses.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
    const { severity, message } = getPHQNineSeverity(totalScore);
    await this.phqNineRepository.create({
      responses,
      patientId,
      totalScore,
      severity,
    });
    return { totalScore, severity, message };
  };
}
