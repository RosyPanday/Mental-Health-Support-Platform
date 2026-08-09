import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const PaymentDefs: DocumentNode = gql`
  input InitiateConsultationPaymentInput { therapistId: Int! }
  input ConfirmConsultationPaymentInput { pidx: String! }
  input UseConsultationTicketInput { therapistId: Int! }
  type ConsultationPaymentData { paymentUrl: String, ticketId: Int, therapistId: Int, status: String }
  type ConsultationPaymentResponse { message: String, data: ConsultationPaymentData }
  type ActiveConsultationTicketData { hasActiveTicket: Boolean }
  type ActiveConsultationTicketResponse { message: String, data: ActiveConsultationTicketData }
  extend type Query {
    activeConsultationTicket: ActiveConsultationTicketResponse
  }
  extend type Mutation {
    initiateConsultationPayment(input: InitiateConsultationPaymentInput!): ConsultationPaymentResponse
    confirmConsultationPayment(input: ConfirmConsultationPaymentInput!): ConsultationPaymentResponse
    useConsultationTicket(input: UseConsultationTicketInput!): ConsultationPaymentResponse
  }
`;
