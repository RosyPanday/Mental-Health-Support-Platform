import { BaseRepository } from "./baseRepository.js";
import Model from "#src/models/index.js";
import type { ConsultationTicketInterface } from "#src/interfaces/consultationTicketInterface.js";

export class ConsultationTicketRepository extends BaseRepository<ConsultationTicketInterface, ConsultationTicketInterface> {
  constructor() { super(Model.ConsultationTicket); }
}
