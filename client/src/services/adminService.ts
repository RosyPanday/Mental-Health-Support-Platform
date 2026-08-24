import { ADMIN_FETCH_UNVERIFIED_THERAPISTS } from "../graphql/queries/adminQueries";

import { ADMIN_VERIFY_THERAPIST } from "../graphql/mutations/adminMutations";
import { apolloClient } from "../api/apolloClient";
import type {
  AdminFetchUnverifiedTherapistsResponse,
  AdminVerifyTherapistResponse,
} from "../interfaces/admin";

export const fetchUnverifiedTherapists = async () => {
  const response =
    await apolloClient.query<AdminFetchUnverifiedTherapistsResponse>({
      query: ADMIN_FETCH_UNVERIFIED_THERAPISTS,

      fetchPolicy: "network-only",
    });

  return response.data?.adminFetchUnverifiedTherapists.data
    .unverifiedTherapists;
};

export const verifyTherapist = async (therapistId: number) => {
  const response = await apolloClient.mutate<AdminVerifyTherapistResponse>({
    mutation: ADMIN_VERIFY_THERAPIST,

    variables: {
      input: {
        therapistId,
      },
    },
  });

  return response.data?.adminVerifyTherapist;
};
