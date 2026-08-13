export class TfIdfService {
  private constructor() {}
  public static tokenize(text: string): string[] {
    if (!text) {
      return [];
    }
    const stopWords = [
      "the",
      "is",
      "a",
      "an",
      "and",
      "to",
      "of",
      "for",
      "i",
      "am",
      "my",
      "have",
      "with",
    ];

    return text
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 0 && !stopWords.includes(word));
  }

  //the spread operator turns the set back into standard array as set doesnt have its own functions
  public static buildVocabulary(tokenizedDocs: string[][]): string[] {
    return [...new Set(tokenizedDocs.flat())];
  }

  //calculate term frequncy for each word /normalizing
  public static calculateTF(tokens: string[]): Record<string, number> {
    if (tokens.length === 0) return {};
    const frequency: Record<string, number> = {};

    tokens.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const totalWords = tokens.length;
    Object.keys(frequency).forEach((word) => {
      frequency[word] = frequency[word]! / totalWords;
    });

    return frequency;
  }

  /**
   * Smoothed IDF calculation: log(1 + N / df) + 1
   * Prevents terms present in every doc from becoming 0
   */
  public static calculateIDF(
    tokenizedDocs: string[][],
    vocabulary: string[],
  ): { [key: string]: number } {
    const totalDocuments = tokenizedDocs.length;
    const idf: Record<string, number> = {};

    vocabulary.forEach((word) => {
      const documentCount = tokenizedDocs.filter((doc) =>
        doc.includes(word),
      ).length;

      idf[word] = Math.log(1 + totalDocuments / (1 + documentCount)) + 1;
    });

    return idf;
  }

  /**
   * Accepts pre-calculated IDF dictionary instead of recomputing
   */
  public static buildVector(
    tokens: string[],
    vocabulary: string[],
    idf: Record<string, number>,
  ): number[] {
    //tf for each word in the user query
    const tf = this.calculateTF(tokens);

    return vocabulary.map((word) => {
      const wordTF = tf[word] || 0;
      const wordIDF = idf[word] || 0;
      return wordTF * wordIDF;
    });
  }

  public static cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    if (
      vectorA.length == 0 ||
      vectorB.length == 0 ||
      vectorA.length != vectorB.length
    ) {
      throw new Error(
        "Input vectors cannot be empty or have different lengths",
      );
    }
    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i]! * vectorB[i]!;
      magnitudeA += vectorA[i]! * vectorA[i]!;
      magnitudeB += vectorB[i]! * vectorB[i]!;
    }

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }
}
