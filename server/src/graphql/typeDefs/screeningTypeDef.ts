import type { DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const screeningDefs: DocumentNode = gql`
  input phqNineScreeningInput {
    responses: [Int!]!
  }
  type phqNineScreeningResponse {
    message: String
  }
  extend type Mutation {
    phqNineScreening(input: phqNineScreeningInput): phqNineScreeningResponse 
  }
`;
