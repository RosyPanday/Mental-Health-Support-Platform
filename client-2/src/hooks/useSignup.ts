import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../graphql/mutations';

export const useSignup = () => {
  return useMutation(SIGNUP_MUTATION);
};
