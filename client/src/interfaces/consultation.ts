import type { ConsultationStatus } from "../types/consultation";

export interface TherapistRecommendation {
  therapist: Therapist;
  similarityPercentage: number;
}

export interface Therapist {
  id: number;
  name: string;
  specialization: string;
  yearsOfExperience: number;
  educationalDocument1: string;
  educationalDocument2: string;
  professionalDoc: string;
  language: string;
  role: string;
  profilePic: string;
}

export interface SearchTherapistsResponse {
  searchTherapists: {
    message: string;
    data: {
      recommendedTherapists: TherapistRecommendation[];
    };
  };
}

export interface RequestConsultationResponse {
  requestConsultation: {
    message: string;
  };
}

export interface ConsultationUser {
  email: string | null;
  phoneNumber: string | null;
}

export interface Payment {
  status: string;
}

export interface PatientInfo {
  id: number;
  name: string;
  age?: number | null;
  issues?: string | null;
  language: string;
  user: ConsultationUser;
}

export interface TherapistInfo {
  id: number;
  name: string;
  educationDegree: string;
  specialization: string;
  yearsOfExperience: number;
  language: string;
  review: number;
  rate: number;
  profilePic: string | null;
  isVerified: boolean;
  user: ConsultationUser;
  payment: Payment | null;
}

export interface Consultation {
  id: number;
  patientId: number;
  therapistId: number;
  preferredTime: string;
  reason: string | null;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
  patient: PatientInfo | null;
  therapist: TherapistInfo | null;
}

export interface ViewConsultationsResponse {
  viewConsultations: {
    message: string;
    data: Consultation[];
  };
}

export interface ConfirmOrCancelBookingResponse {
  confirmOrCancelBooking: {
    message: string;
  };
}

export interface JoinVideoCallResponse {
  joinVideoCall: {
    message: string;
    data: {
      meetingLink: string;
    };
  };
}

export interface InitiateKhaltiPaymentResponse {
  initiateKhaltiPayment: {
    message: string;
    data: {
      paymentUrl: string;
      pidx: string;
    };
  };
}

export interface VerifyKhaltiPaymentResponse {
  verifyKhaltiPayment: {
    message: string;
    data: {
      status: string;
    };
  };
}

export interface ConsultationListProps {
  status: ConsultationStatus;
}

export interface ConsultationPageCopy {
  eyebrow: string;
  title: string;
  description: string;
}
