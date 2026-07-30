import { PHQSeverityEnum } from "#src/enums/screeningEnum.js";

export const getPHQNineSeverity = (
  totalScore: number,
): { severity: string; message: string } => {
  if (totalScore <= 4)
    return {
      severity: PHQSeverityEnum.none,
      message:
        "Your score indicates minimal to no depressive symptoms. If you ever feel like speaking with a mental health professional, you are always welcome to request an appointment.",
    };
  if (totalScore <= 9)
    return {
      severity: PHQSeverityEnum.mild,
      message:
        "Your score indicates mild depressive symptoms. Keeping track of your mood and practicing self-care can help. Would you like to schedule a consultation with a specialist?",
    };
  if (totalScore <= 14)
    return {
      severity: PHQSeverityEnum.moderate,
      message:
        "Your score suggests moderate depressive symptoms. Speaking with a qualified doctor or psychiatrist can provide clarity and support. Would you like to request a booking now?",
    };
  if (totalScore <= 19)
    return {
      severity: PHQSeverityEnum.moderatelySevere,
      message:
        "Your score reflects moderately severe depressive symptoms. We strongly recommend consulting with a psychiatrist or therapist to discuss treatment options. Would you like to book an appointment?",
    };
  return {
    severity: PHQSeverityEnum.severe,
    message:
      "Your score indicates severe depressive symptoms. Professional guidance and support are highly recommended. Would you like us to assist you in booking a session with a psychiatrist?",
  };
};
