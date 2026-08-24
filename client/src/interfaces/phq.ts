export interface PhqNineScreeningResponse {
  phqNineScreening: {
    message: string;
    data: {
      responses: number[];
      totalScore: number;
    };
  };
}

export interface PHQQuestion {
  id: number;
  question: string;
}

export interface ScreeningResult {
  message: string;
  data: {
    responses: number[];
    totalScore: number;
  };
}
