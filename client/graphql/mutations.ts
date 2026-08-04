import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: InputSignup!) {
    signup(input: $input) {
      message
      token
      user {
        username
        name
        role
      }
    }
  }
`;