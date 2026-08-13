export interface UnverifiedTherapist {
  id: number;
  name: string;
  specialization: string;
  language: string;
  email: string | null;
  phoneNumber: string | null;
  profilePic: string | null;
  educationalDoc1: string | null;
  educationalDoc2: string | null;
  professionalDoc: string | null;
}

export interface AdminFetchUnverifiedTherapistsResponse {
  adminFetchUnverifiedTherapists: {
    message: string;
    data: {
      unverifiedTherapists: UnverifiedTherapist[];
    };
  };
}

export interface AdminVerifyTherapistResponse {
  adminVerifyTherapist: {
    message: string;
  };
}
