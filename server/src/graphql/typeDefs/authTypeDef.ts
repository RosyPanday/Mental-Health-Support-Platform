import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const authDefs: DocumentNode = gql`
  #graphql
  enum UserRole {
    patient
    therapist
    admin
  }
  type User {
    id: ID
    username: String
    phoneNumber: String
    email:String
    role: UserRole
  }
  type SignupData {
    token: String
    user: User
  }
  type SignupResponse {
    message: String
    data: SignupData
  }
  input InputSignup {
    username: String
    name: String
    phoneNumber: String
    role: UserRole
    password: String
    rate:Int
    email: String
    language: String
    age: Int
    issues: String
    yearsOfExperience: Int
    educationDegree: String
    specialization: String
    # confirmPassword:String
  }
  input InputLogin {
    username: String
    password:String
    role: UserRole
  }
  # extend type Query {
  # }
  type Mutation {
    signup(input: InputSignup): SignupResponse
    login(input: InputLogin): SignupResponse
  }
`;
