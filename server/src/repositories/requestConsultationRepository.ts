import { BaseRepository } from "./baseRepository.js";
import Model from "#src/models/index.js";
import type { RequestConsultationInterface } from "#src/interfaces/requestConsultationInterface.js";

export class RequestConsultationRepository extends BaseRepository<
  RequestConsultationInterface,
  RequestConsultationInterface
> {
  constructor() {
    super(Model.RequestConsultation);
  }
}
