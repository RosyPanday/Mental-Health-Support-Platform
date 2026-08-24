import { type DocumentNode } from "graphql";
import { gql } from "graphql-tag";

export const videoCallDefs: DocumentNode = gql`
  #graphql
  type VideoRoom {
    meetingLink: String
  }

  type VideoRoomResponse {
    message: String
    data: VideoRoom
  }

  input InputJoinVideoCall {
    consultationId: Int!
  }

  extend type Mutation {
    joinVideoCall(input: InputJoinVideoCall!): VideoRoomResponse
  }
`;
