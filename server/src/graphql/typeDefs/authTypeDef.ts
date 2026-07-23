import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const authDefs: DocumentNode = gql`
  #graphql
  enum UserRole{
    patient
    therapist
  }
  type User {
    id:ID
    username: String
    name: String
    phoneNumber: String
    role:UserRole
  }
  type SignupData{
    token:String
    user:User
  }
  type SignupResponse {
    message:String
    data: SignupData
  }
  input InputSignup{
    username:String
    name:String
    phoneNumber:String
    role:String
    password:String
    email:String
    language:String
    yearsOfExperience:Int
    educationDegree:String
    specialization:String
    # confirmPassword:String
  }
  # extend type Query {
  # }
  type Mutation {
    signup(input: InputSignup): SignupResponse
  }
`;
