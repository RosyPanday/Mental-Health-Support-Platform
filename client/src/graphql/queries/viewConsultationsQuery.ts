export const VIEW_CONSULTATIONS_QUERY = `
query ViewConsultations($input: InputViewConsultations!) {
  viewConsultations(input: $input) {
    message
    data {
      id
      patientId
      therapistId
      preferredTime
      reason
      status
      createdAt
      updatedAt

      patient {
        id
        name
        age
        issues
        language
        user {
          email
          phoneNumber
        }
      }

      therapist {
        id
        name
        educationDegree
        specialization
        yearsOfExperience
        language
        review
        rate
        profilePic
        isVerified

        user {
          email
          phoneNumber
        }

        payment {
          status
        }
      }
    }
  }
}
`;