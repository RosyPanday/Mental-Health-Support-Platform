import { TherapistRepository } from "#src/repositories/therapistRepository.js";
import { TfIdfService } from "#src/services/tfIdfService.js";

export class TherapistRecommendationService {
  private therapistRepository: TherapistRepository;

  constructor() {
    this.therapistRepository = new TherapistRepository();
  }

  async recommendTherapists(description: string) {
    const therapists = await this.therapistRepository.findAll({
      where: { isVerified: true },
    });

    if (therapists.length === 0) return [];

    //tokenized Docs contain specialization of each therapist inside array, specialization of thererapist 0 is tokenizedDocs[0]
    const tokenizedDocs: string[][] = therapists.map((t) =>
      TfIdfService.tokenize(t.specialization || ""),
    );

    //total vocabulary of all therapists in the db eg:["anxiety","depression"]
    const vocabulary = TfIdfService.buildVocabulary(tokenizedDocs);
    //Key-value pairs mapping each term in the vocabulary to its Inverse Document Frequency (IDF) score.
    const idf = TfIdfService.calculateIDF(tokenizedDocs, vocabulary);

    const userTokens = TfIdfService.tokenize(description);
    //A numeric TF-IDF vector representing the user query. Its length matches the exact length of vocabulary, where each index holds the calculated TF-IDF weight for that vocabulary term in the user's description.
    const userVector = TfIdfService.buildVector(userTokens, vocabulary, idf);

    // Vectorize each therapist individually and calculate similarity
    const results = therapists.map((therapist, index) => {
      const therapistTokens = tokenizedDocs[index];
      const therapistVector = TfIdfService.buildVector(
        therapistTokens!,
        vocabulary,
        idf,
      );

      const similarity = TfIdfService.cosineSimilarity(
        userVector,
        therapistVector,
      );

      return {
        therapist,
        similarity: Number(similarity.toFixed(3)),
      };
    });

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }
}
