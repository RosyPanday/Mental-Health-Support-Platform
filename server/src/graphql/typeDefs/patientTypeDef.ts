import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const PatientDefs: DocumentNode = gql`
  #graphql

  input searchTherapistsInput {
    description: String!
  }

  input RequestConsultationInput {
    preferredTime: String!
    therapistId: Int!
  }

  type RecommendedTherapistsData {
    recommendedTherapists: [Therapist!]
  }

  type TherapistRecommendationResponse {
    message: String
    data: String
  }

  type RequestConsultationResponse {
    message: String
    data: String
  }

  type Query {
    searchTherapists(
      input: searchTherapistsInput
    ): TherapistRecommendationResponse
  }

  extend type Mutation {
    requestConsultation(
      input: RequestConsultationInput!
    ): RequestConsultationResponse
  }
`;
