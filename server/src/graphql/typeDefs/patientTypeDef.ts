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

  type RecommendedTherapist {
    therapist: Therapist!
    similarityPercentage: Float!
  }

  type RecommendedTherapistsData {
    recommendedTherapists: [RecommendedTherapist!]
  }

  type TherapistRecommendationResponse {
    message: String
    data:RecommendedTherapistsData
  }

  type RequestConsultationResponse {
    message: String
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
