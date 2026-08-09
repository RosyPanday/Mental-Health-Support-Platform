import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const TherapistDefs: DocumentNode = gql`
  #graphql
  type Therapist {
    id: Int
    name:String
    username: String
    phoneNumber: String
    email: String
    specialization: String
    yearsOfExperience: Int
    educationDegree: String
    review: Float
    isVerified: Boolean
    educationalDocument1: String
    educationalDocument2: String
    professionalDoc: String
language:String
    role:UserRole
    profilePic: String
    isOnline: Boolean
  }
  type TherapistListData {
    therapists: [Therapist!]!
  }
type TherapistListResponse {
    message: String
    data: TherapistListData
  }
  type TherapistProfileData {
    therapist: Therapist
  }
  type TherapistProfileResponse {
    message: String
    data: TherapistProfileData
  }
  extend type Query {
    therapists: TherapistListResponse
    therapistProfile: TherapistProfileResponse
  }
`;
