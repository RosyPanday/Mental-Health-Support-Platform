import { BaseRepository } from "./baseRepository.js";
import Model from "#src/models/index.js";
import type { PaymentInterface } from "#src/interfaces/index.js";

export class PaymentRepository extends BaseRepository<
  PaymentInterface,
  PaymentInterface
> {
  constructor() {
    super(Model.Payments);
  }

  public async findByConsultationId(
    requestConsultationId: number,
  ): Promise<PaymentInterface | null> {
    return await this.findOne({
      where: {
        requestConsultationId,
      },
    });
  }
}
