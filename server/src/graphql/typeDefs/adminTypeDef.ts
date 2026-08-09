import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const AdminDefs: DocumentNode = gql`
  #graphql
  type AdminFetchUnverifiedTherapistsData {
    unverifiedTherapists: [UnverifiedTherapists!]
  }
  type UnverifiedTherapists {
    id: Int
    name: String
    username: String
    phoneNumber: String
    email: String
    specialization: String
    yearsOfExperience: Int
    educationalDoc1: String
    educationalDoc2: String
    professionalDoc: String
    language: String
    role: UserRole
    profilePic: String
    user: User
  }
  type AdminFetchUnverifiedTherapistsResponse {
    message: String!
    data: AdminFetchUnverifiedTherapistsData!
  }

  type AdminVerifyTherapistResponse {
    message: String!
  }

  extend type Query {
    adminFetchUnverifiedTherapists: AdminFetchUnverifiedTherapistsResponse!
  }

  input AdminVerifyTherapistInput {
    therapistId: Int!
  }

  extend type Mutation {
    adminVerifyTherapist(
      input: AdminVerifyTherapistInput!
    ): AdminVerifyTherapistResponse!
  }
`;
