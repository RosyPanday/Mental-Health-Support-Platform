import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const TherapistDefs: DocumentNode = gql`
  #graphql
  type Therapist {
    id: Int
    name: String
    username: String
    phoneNumber: String
    email: String
    specialization: String
    yearsOfExperience: Int
    educationalDocument1: String
    educationalDocument2: String
    professionalDoc: String
    language: String
    role: UserRole
    profilePic: String
  }
  enum RequestConsultationStatusEnum {
    confirmed
    cancelled
  }

  input ConfirmOrCancelBookingInput {
    consultationId: Int!
    status: RequestConsultationStatusEnum!
    reason: String
  }

  type ConfirmOrCancelBookingResponse {
    message: String
  }

  extend type Mutation {
    confirmOrCancelBooking(
      input: ConfirmOrCancelBookingInput!
    ): ConfirmOrCancelBookingResponse
  }
`;
