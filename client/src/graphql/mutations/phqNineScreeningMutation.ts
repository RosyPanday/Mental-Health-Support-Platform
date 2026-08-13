export const PHQ_NINE_SCREENING_MUTATION = `
mutation PhqNineScreening($input: phqNineScreeningInput) {
  phqNineScreening(input: $input) {
    message
    data {
      responses
      totalScore
    }
  }
}
`;
