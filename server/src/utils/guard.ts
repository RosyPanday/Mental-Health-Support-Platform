import {
  PatientRepository,
  TherapistRepository,
} from "#src/repositories/index.js";

export class Guard {
  //static module dependencies
  private static patientRepository = new PatientRepository();
  private static therapistRepository = new TherapistRepository();
  //private constructor to guarantee outside modules cannot access with new Guard

  private constructor() {}

  //static methods so the functions remain to the class, with no multiple instances everytime
  static async grantPatient(userId: number|undefined) {
    if(!userId){
        throw new Error("Forbidden: You are not authorized to perform this action.");
    }
    const patient = await this.patientRepository.getPatientIdFromUserId(userId);
    if (!patient) {
      throw new Error("No client record exists in database for this user");
    }
    return patient.id;
  }

  static async grantTherapist(userId: number) {
    //logic for getting therapist
  }
}
