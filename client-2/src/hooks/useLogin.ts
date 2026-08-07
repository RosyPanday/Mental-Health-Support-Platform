import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';

export const useLogin = () => {
  return useMutation(LOGIN_MUTATION);
};
