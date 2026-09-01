import { gql } from "@apollo/client";

export const ADMIN_FETCH_UNVERIFIED_THERAPISTS = gql`
  query AdminFetchUnverifiedTherapists {
    adminFetchUnverifiedTherapists {
      message

      data {
        unverifiedTherapists {
          id
          name
          specialization
          language
          email
          phoneNumber
          profilePic
          educationalDoc1
          educationalDoc2
          professionalDoc
        }
      }
    }
  }
`;
