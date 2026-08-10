import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const consultationDefs: DocumentNode = gql`
  #graphql

  type Consultation {
    id: Int
    patientId: Int
    therapistId: Int
    preferredTime: String
    reason: String
    status: ConsultationStatusEnum
    createdAt: String
    updatedAt: String
    patient: ConsultationPatient
    therapist: ConsultationTherapist
  }

  type ConsultationPatient {
    id: Int
    name: String
    language: String
    user: User
  }

  type ConsultationTherapist {
    id: Int
    name: String
    educationDegree: String
    specialization: String
    yearsOfExperience: Int
    language: String
    review: Float
    rate: Int
    profilePic: String
    isVerified: Boolean
    user: User
    payment:Payment
  }

  type ViewConsultationsResponse {
    message: String
    data: [Consultation]
  }

  input InputViewConsultations {
    status: ConsultationStatusEnum!
  }

  extend type Query {
    viewConsultations(input: InputViewConsultations!): ViewConsultationsResponse
  }
`;
