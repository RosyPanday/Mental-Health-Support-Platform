import type { DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const PaymentDefs: DocumentNode = gql`
  #graphql
  input initiateKhaltiPaymentInput {
    requestConsultationId: Int!
  }
  input VerifyKhaltiPaymentInput {
    pidx: String!
  }
  type initiateKhaltiPaymentData {
    pidx: String!
    paymentUrl: String!
  }

  type initiateKhaltiPaymentResponse {
    message: String
    data: initiateKhaltiPaymentData
  }

  type VerifyKhaltiPaymentData {
    status: String!
  }

  type Payment {
    amount: Int
    status: String
  }
  type VerifyKhaltiPaymentResponse {
    message: String
    data: VerifyKhaltiPaymentData
  }

  extend type Mutation {
    initiateKhaltiPayment(
      input: initiateKhaltiPaymentInput!
    ): initiateKhaltiPaymentResponse

    verifyKhaltiPayment(
      input: VerifyKhaltiPaymentInput!
    ): VerifyKhaltiPaymentResponse
  }
`;
