import { gql } from "@apollo/client";

import { apolloClient } from "../api/apolloClient";

import { VIEW_CONSULTATIONS_QUERY } from "../graphql/queries/viewConsultationsQuery";

import { SEARCH_THERAPISTS_QUERY } from "../graphql/queries/searchTherapistsQuery";

import { REQUEST_CONSULTATION_MUTATION } from "../graphql/mutations/requestConsultationMutation";
import { JOIN_VIDEO_CALL } from "../graphql/mutations/joinVideoCallMutation";
import { INITIATE_KHALTI_PAYMENT } from "../graphql/mutations/initiateKhaltiPaymentMutation";
import { VERIFY_KHALTI_PAYMENT } from "../graphql/mutations/verifyKhaltiPaymentMutation";
import type {
  SearchTherapistsResponse,
  RequestConsultationResponse,
  ViewConsultationsResponse,
  JoinVideoCallResponse,
  InitiateKhaltiPaymentResponse,
  VerifyKhaltiPaymentResponse,
} from "../interfaces/consultation";

import { CONFIRM_OR_CANCEL_BOOKING_MUTATION } from "../graphql/mutations/confirmOrCancelBookingMutation";

import type { ConfirmOrCancelBookingResponse } from "../interfaces/consultation";
import type { ConsultationDecision, ConsultationStatus } from "../types/consultation";

export async function searchTherapists(description: string) {
  const response = await apolloClient.query<SearchTherapistsResponse>({
    query: gql(SEARCH_THERAPISTS_QUERY),

    variables: {
      input: {
        description,
      },
    },

    fetchPolicy: "no-cache",
  });

  return response.data!.searchTherapists.data.recommendedTherapists;
}

export async function requestConsultation(
  therapistId: number,

  preferredTime: string,
) {
  const response = await apolloClient.mutate<RequestConsultationResponse>({
    mutation: gql(REQUEST_CONSULTATION_MUTATION),

    variables: {
      input: {
        therapistId,

        preferredTime,
      },
    },
  });

  return response.data?.requestConsultation;
}

export async function viewConsultations(
  status: ConsultationStatus,
) {
  const response = await apolloClient.query<ViewConsultationsResponse>({
    query: gql(VIEW_CONSULTATIONS_QUERY),

    variables: {
      input: {
        status,
      },
    },

    fetchPolicy: "no-cache",
  });

  return response.data!.viewConsultations.data;
}

export async function confirmOrCancelBooking(
  consultationId: number,

  status: ConsultationDecision,

  reason?: string,
) {
  const response = await apolloClient.mutate<ConfirmOrCancelBookingResponse>({
    mutation: gql(CONFIRM_OR_CANCEL_BOOKING_MUTATION),

    variables: {
      input: {
        consultationId,

        status,

        ...(reason && {
          reason,
        }),
      },
    },
  });

  return response.data?.confirmOrCancelBooking;
}

export const joinVideoCall = async (consultationId: number) => {
  const response = await apolloClient.mutate<JoinVideoCallResponse>({
    mutation: JOIN_VIDEO_CALL,
    variables: {
      input: {
        consultationId,
      },
    },
  });

  return response.data?.joinVideoCall;
};

export const initiateKhaltiPayment = async (
  requestConsultationId: number,
) => {
  const response = await apolloClient.mutate<InitiateKhaltiPaymentResponse>({
    mutation: INITIATE_KHALTI_PAYMENT,

    variables: {
      input: {
        requestConsultationId,
      },
    },
  });

  return response.data?.initiateKhaltiPayment;
};

export const verifyKhaltiPayment = async (pidx: string) => {
  const response = await apolloClient.mutate<VerifyKhaltiPaymentResponse>({
    mutation: VERIFY_KHALTI_PAYMENT,

    variables: {
      input: {
        pidx,
      },
    },
  });

  return response.data?.verifyKhaltiPayment;
};
