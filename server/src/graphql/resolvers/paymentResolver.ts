import { RoleEnum } from "#src/enums/roleEnum.js";
import type { ContextInterface } from "#src/interfaces/contextHandlerInterface.js";
import Model from "#src/models/index.js";
import { PatientRepository, TherapistRepository, PHQNineRepository } from "#src/repositories/index.js";
import { ConsultationTicketRepository } from "#src/repositories/consultationTicketRepository.js";
import { CONSULTATION_TICKET_AMOUNT, KhaltiPaymentService } from "#src/services/khaltiPaymentService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { frontendUrl } from "#src/config/index.js";

export const PaymentResolver = { Query: {
  activeConsultationTicket: async (_: ParentNode, __: any, context: ContextInterface) => {
    requireRole(context.role, [RoleEnum.patient]);
    const patient = await new PatientRepository().getPatientIdFromUserId(context.id!);
    if (!patient) return GraphqlResponse.send({ message: "Patient record not found.", data: { hasActiveTicket: false } });
    const activeTicket = await new ConsultationTicketRepository().findOne({ where: { patientId: patient.id, status: "COMPLETED" } });
    return GraphqlResponse.send({ message: activeTicket ? "Active ticket available." : "No active ticket.", data: { hasActiveTicket: !!activeTicket } });
  },
},  Mutation: {
  initiateConsultationPayment: async (_: ParentNode, args: { input: { therapistId: number } }, context: ContextInterface) => {
    requireRole(context.role, [RoleEnum.patient]);
    const patient = await new PatientRepository().getPatientIdFromUserId(context.id!);
    const therapist = await new TherapistRepository().findByPk(args.input.therapistId);
    const user = await Model.User.findByPk(context.id);
    if (!patient || !therapist || !user) throw new Error("Selected therapist is not available.");
    if (!therapist.isVerified) throw new Error("This therapist is not available for consultation right now.");
    const screeningCount = await new PHQNineRepository().count({ where: { patientId: patient.id } });
    if (!screeningCount) throw new Error("Complete the PHQ-9 screening before purchasing a consultation ticket.");
    const patientRecord = await new PatientRepository().findByPk(patient.id);
    if (!patientRecord) throw new Error("Patient record was not found.");
    const tickets = new ConsultationTicketRepository();
    const ticket = await tickets.create({ patientId: patient.id, therapistId: therapist.id, amount: CONSULTATION_TICKET_AMOUNT, status: "INITIATED", orderId: `consultation-${Date.now()}-${patient.id}` });
    const payment = await new KhaltiPaymentService().initiate({ return_url: `${frontendUrl}/payment/khalti/callback`, website_url: frontendUrl, amount: CONSULTATION_TICKET_AMOUNT, purchase_order_id: ticket.orderId, purchase_order_name: "CalmSpace consultation ticket", customer_info: { name: patientRecord.name, email: user.email, phone: user.phoneNumber } });
    await tickets.update({ where: { id: ticket.id }, input: { pidx: payment.pidx } });
    return GraphqlResponse.send({ message: "Redirecting to Khalti.", data: { paymentUrl: payment.payment_url, ticketId: ticket.id, status: "INITIATED" } });
  },
  confirmConsultationPayment: async (_: ParentNode, args: { input: { pidx: string } }, context: ContextInterface) => {
    requireRole(context.role, [RoleEnum.patient]);
    const patient = await new PatientRepository().getPatientIdFromUserId(context.id!);
    const tickets = new ConsultationTicketRepository();
    const ticket = await tickets.findOne({ where: { pidx: args.input.pidx } });
    if (!patient || !ticket || ticket.patientId !== patient.id) throw new Error("Payment ticket was not found.");
    const lookup = await new KhaltiPaymentService().lookup(args.input.pidx);
    if (lookup.pidx !== ticket.pidx || lookup.status !== "Completed" || lookup.total_amount !== CONSULTATION_TICKET_AMOUNT) throw new Error("Payment has not been completed.");
    await tickets.update({ where: { id: ticket.id }, input: { status: "COMPLETED", transactionId: lookup.transaction_id } });
    return GraphqlResponse.send({ message: "Payment confirmed.", data: { ticketId: ticket.id, therapistId: ticket.therapistId, status: "COMPLETED" } });
  },
  useConsultationTicket: async (_: ParentNode, args: { input: { therapistId: number } }, context: ContextInterface) => {
    requireRole(context.role, [RoleEnum.patient]);
    const patient = await new PatientRepository().getPatientIdFromUserId(context.id!);
    const tickets = new ConsultationTicketRepository();
    const ticket = await tickets.findOne({ where: { patientId: patient?.id, status: "COMPLETED" }, order: [["id", "DESC"]] });
    if (!patient || !ticket) throw new Error("You do not have an active ticket. Please buy a ticket first.");
    const therapist = await new TherapistRepository().findByPk(args.input.therapistId);
    if (!therapist || !therapist.isVerified) throw new Error("This therapist is not available to take your call right now.");
    await tickets.update({ where: { id: ticket.id }, input: { therapistId: therapist.id, status: "USED" } });
    return GraphqlResponse.send({ message: "Call started with the therapist. This ticket has been used.", data: { ticketId: ticket.id, therapistId: therapist.id, status: "USED" } });
  },
} };
