import { gql } from "@apollo/client";

import { apolloClient } from "../api/apolloClient";

import {
  PHQ_NINE_SCREENING_MUTATION
} from "../graphql/mutations/phqNineScreeningMutation";

import type {
  PhqNineScreeningResponse
} from "../interfaces/phq";


export async function submitPhqScreening(
  responses: number[]
) {


  const response =
    await apolloClient.mutate<PhqNineScreeningResponse>({

      mutation: gql(PHQ_NINE_SCREENING_MUTATION),

      variables: {

        input: {

          responses

        }

      }

    });



  return response.data!.phqNineScreening;

}
