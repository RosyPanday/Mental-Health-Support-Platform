import { khaltiBaseUrl, khaltiSecretKey } from "#src/config/index.js";

export const CONSULTATION_TICKET_AMOUNT = 59900;

export class KhaltiPaymentService {
  private headers() {
    if (!khaltiSecretKey) throw new Error("Khalti payment is not configured yet.");
    return { Authorization: `Key ${khaltiSecretKey}`, "Content-Type": "application/json" };
  }

  async initiate(payload: object) {
    const response = await fetch(`${khaltiBaseUrl}/epayment/initiate/`, { method: "POST", headers: this.headers(), body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("Unable to start Khalti payment. Please try again.");
    return await response.json() as { pidx: string; payment_url: string };
  }

  async lookup(pidx: string) {
    const response = await fetch(`${khaltiBaseUrl}/epayment/lookup/`, { method: "POST", headers: this.headers(), body: JSON.stringify({ pidx }) });
    if (!response.ok) throw new Error("Unable to verify Khalti payment. Please try again.");
    return await response.json() as { pidx: string; status: string; total_amount: number; transaction_id: string | null };
  }
}
