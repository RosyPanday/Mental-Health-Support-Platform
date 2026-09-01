import { gql } from "@apollo/client";

export const INITIATE_KHALTI_PAYMENT = gql`
  mutation InitiateKhaltiPayment($input: initiateKhaltiPaymentInput!) {
    initiateKhaltiPayment(input: $input) {
      message

      data {
        paymentUrl
        pidx
      }
    }
  }
`;
