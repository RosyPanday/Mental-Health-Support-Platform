import { gql } from "@apollo/client";

export const VERIFY_KHALTI_PAYMENT = gql`
  mutation VerifyKhaltiPayment($input: VerifyKhaltiPaymentInput!) {
    verifyKhaltiPayment(input: $input) {
      message

      data {
        status
      }
    }
  }
`;
