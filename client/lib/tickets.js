const ACTIVE_TICKET_KEY = "activeConsultationTicket";

export function hasPurchasedTicket() {
  try {
    return localStorage.getItem(ACTIVE_TICKET_KEY) === "1";
  } catch {
    return false;
  }
}

export function savePurchasedTherapistId() {
  localStorage.setItem(ACTIVE_TICKET_KEY, "1");
}

export function consumeActiveTicket() {
  localStorage.removeItem(ACTIVE_TICKET_KEY);
}