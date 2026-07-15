import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const userDefs: DocumentNode = gql`
  #graphql
  type User {
    username: String
    name: String
    phoneNumber: String
    role: String
  }

  type signupResponse {
    message: String
    token: String
    user: User
  }

  input InputSignup {
    username: String!
    name: String!
    phoneNumber: String!
    role: String!
    password: String!
    confirmPassword: String!
  }

  # Root types 
  type Query {
    _empty: String
  }

  type Mutation {
    signup(input: InputSignup!): signupResponse!
  }
`;