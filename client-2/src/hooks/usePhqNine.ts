import { useMutation } from '@apollo/client';
import { PHQ_NINE_MUTATION } from '../graphql/mutations';

export const usePhqNine = () => {
  return useMutation(PHQ_NINE_MUTATION);
};
