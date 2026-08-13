import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import PatientShell from "../../components/PatientShell/PatientShell";
import { verifyKhaltiPayment } from "../../services/consultationService";

import "./KhaltiVerification.css";

export default function KhaltiVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming your payment with Khalti…");
  const [error, setError] = useState("");

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    const verify = async () => {
      try {
        const pidx = searchParams.get("pidx");

        if (!pidx) {
          setError("The payment identifier is missing. Return to your consultation and try again.");
          return;
        }

        const response = await verifyKhaltiPayment(pidx);
        setMessage(response?.message || "Your payment was verified successfully.");
        redirectTimer = setTimeout(() => {
          navigate("/confirmed-consultations", { replace: true });
        }, 2200);
      } catch (error: any) {
        console.error(error);
        setError(
          error?.graphQLErrors?.[0]?.message ||
            error?.networkError?.result?.errors?.[0]?.message ||
            error?.message ||
            "We could not verify your payment. Please try again.",
        );
      }
    };

    verify();
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [navigate, searchParams]);

  return (
    <PatientShell>
      <main className="patient-page-shell payment-verification">
        <section className={`payment-verification__card${error ? " payment-verification__card--error" : ""}`}>
          <span className="payment-verification__icon" aria-hidden="true">
            {error ? "!" : <span className="payment-verification__spinner" />}
          </span>
          <p className="patient-page-eyebrow">Payment verification</p>
          <h1>{error ? "Payment needs attention" : "Almost finished"}</h1>
          <p>{error || message}</p>
          {error ? (
            <div className="payment-verification__actions">
              <Link to="/confirmed-consultations">Return to consultations</Link>
              <Link to="/patient-dashboard">Go to overview</Link>
            </div>
          ) : (
            <small>You will be redirected to your confirmed consultations shortly.</small>
          )}
        </section>
      </main>
    </PatientShell>
  );
}
