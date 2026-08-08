import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: InputLogin) {
    login(input: $input) {
      message
      data {
        token
        user {
          username
        }
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: InputSignup) {
    signup(input: $input) {
      message
      data {
        token
        user {
          id
          username
          name
        }
      }
    }
  }
`;

export const PHQ_NINE_MUTATION = gql`
  mutation PhqNineScreening($input: phqNineScreeningInput) {
    phqNineScreening(input: $input) {
      message
      data {
        responses
        totalScore
      }
    }
  }
`;
