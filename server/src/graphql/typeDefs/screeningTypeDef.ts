import type { DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const screeningDefs: DocumentNode = gql`
#graphql
  input phqNineScreeningInput {
    responses: [Int!]!
  }
  type phqNineScreeningResponse {
    message: String
    data: phqNine
  }

  type phqNine{
    id: Int
    userId: Int
    patientId: Int
    responses: [Int!]
    totalScore: Int
    severity: String
  }
  extend type Mutation {
    phqNineScreening(input: phqNineScreeningInput): phqNineScreeningResponse 
  }
`;
