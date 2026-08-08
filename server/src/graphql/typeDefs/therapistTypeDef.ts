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
    educationalDocument1: String
    educationalDocument2: String
    professionalDoc: String
    language:String
    role:UserRole
    profilePic: String
  }
  
`;
