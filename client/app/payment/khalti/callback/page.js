"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { savePurchasedTherapistId } from "@/lib/tickets";

function KhaltiCallbackContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState({ loading: true, success: false, message: "Verifying your payment..." });

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const token = localStorage.getItem("authToken");
    async function confirm() {
      if (!pidx || !token) { setState({ loading: false, success: false, message: "We could not verify this payment." }); return; }
      try {
        const response = await fetch("http://localhost:4000/graphql", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ query: "mutation ConfirmPayment($input: ConfirmConsultationPaymentInput!) { confirmConsultationPayment(input: $input) { message data { status therapistId } } }", variables: { input: { pidx } } }) });
        const result = await response.json();
        const payment = result.data?.confirmConsultationPayment;
        if (!response.ok || result.errors || payment?.data?.status !== "COMPLETED") throw new Error("Payment not completed");
        savePurchasedTherapistId();
        setState({ loading: false, success: true, message: payment.message });
      } catch { setState({ loading: false, success: false, message: "Payment could not be confirmed yet. If payment was completed, please try again shortly." }); }
    }
    confirm();
  }, [searchParams]);

  return <main className="mx-auto max-w-lg px-4 py-16"><section className="rounded-2xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-slate-800">{state.loading ? "Confirming payment" : state.success ? "Payment successful" : "Payment confirmation pending"}</h1><p className="mt-4 leading-7 text-slate-600">{state.message}</p>{!state.loading && <Link href={state.success ? "/therapists" : "/therapists"} className="mt-7 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">{state.success ? "Return to therapists" : "Back to therapists"}</Link>}</section></main>;
}

export default function KhaltiCallbackPage() {
  return <Suspense fallback={<main className="mx-auto max-w-lg px-4 py-16"><section className="rounded-2xl bg-white p-8 text-center shadow-sm"><p className="text-slate-600">Verifying your payment...</p></section></main>}><KhaltiCallbackContent /></Suspense>;
}