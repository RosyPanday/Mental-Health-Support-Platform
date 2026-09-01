export type ConsultationStatus = "pending" | "confirmed" | "cancelled";
export type ConsultationDecision = Exclude<ConsultationStatus, "pending">;
export type ConsultationCounts = Record<ConsultationStatus, number | null>;
