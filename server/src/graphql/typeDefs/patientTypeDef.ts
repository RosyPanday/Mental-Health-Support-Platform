import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const PatientDefs: DocumentNode = gql`
  #graphql

  input searchTherapistsInput {
    description: String!
  }

  type RecommendedTherapistsData {
    recommendedTherapists: [Therapist!]
  }

  type TherapistRecommendationResponse {
    message: String
    data: RecommendedTherapistsData
  }

  type Query {
    searchTherapists(
      input: searchTherapistsInput
    ): TherapistRecommendationResponse
  }
`;
