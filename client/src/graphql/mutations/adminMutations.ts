import { gql } from "@apollo/client";

export const ADMIN_VERIFY_THERAPIST = gql`
  mutation AdminVerifyTherapist($input: AdminVerifyTherapistInput!) {
    adminVerifyTherapist(input: $input) {
      message
    }
  }
`;
