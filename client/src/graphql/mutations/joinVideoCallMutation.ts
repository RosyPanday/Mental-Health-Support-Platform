import { gql } from "@apollo/client";

export const JOIN_VIDEO_CALL = gql`
  mutation JoinVideoCall($input: InputJoinVideoCall!) {
    joinVideoCall(input: $input) {
      message
      data {
        meetingLink
      }
    }
  }
`;
