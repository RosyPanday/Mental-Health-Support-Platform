"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Star, UserRound } from "lucide-react";
import { consumeActiveTicket, hasPurchasedTicket } from "@/lib/tickets";
import { saveCallSession } from "@/lib/video";

const therapistQuery = `
  query Therapists {
    therapists {
      data {
        therapists {
          id
          name
          educationDegree
          specialization
          yearsOfExperience
          language
          review
          isVerified
          profilePic
        }
      }
    }
  }
`;

function TherapistCard({ therapist, onBuyTicket, onMakeCall, hasActive, isStartingPayment, isStartingCall }) {
  const initials = therapist.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700" aria-label={`${therapist.name} profile avatar`}>
          {initials || <UserRound size={22} />}
        </div>
        <div>
          <h2 className="font-bold text-slate-800">{therapist.name}</h2>
          {therapist.specialization && <p className="text-sm text-emerald-700">{therapist.specialization}</p>}
        </div>
      </div>
      <dl className="mt-5 space-y-2 text-sm text-slate-600">
        {therapist.educationDegree && <div><dt className="inline font-semibold text-slate-700">Qualification: </dt><dd className="inline">{therapist.educationDegree}</dd></div>}
        {Number.isInteger(therapist.yearsOfExperience) && <div><dt className="inline font-semibold text-slate-700">Experience: </dt><dd className="inline">{therapist.yearsOfExperience} years</dd></div>}
        {therapist.language && <div><dt className="inline font-semibold text-slate-700">Language: </dt><dd className="inline">{therapist.language}</dd></div>}
        {therapist.review > 0 && <div className="flex items-center gap-1"><Star size={15} className="fill-amber-400 text-amber-400" /><span>{therapist.review}</span></div>}
      </dl>
      {therapist.isVerified ? (
        hasActive ? (
          <button type="button" disabled={isStartingCall} onClick={() => onMakeCall(therapist.id)} className="mt-6 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:bg-slate-300">{isStartingCall ? "Starting call..." : "Make a call"}</button>
        ) : (
          <button type="button" disabled={isStartingPayment} onClick={() => onBuyTicket(therapist.id)} className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300">{isStartingPayment ? "Starting payment..." : "Buy Ticket — NPR 599"}</button>
        )
      ) : (
        <button type="button" disabled className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500">Unavailable</button>
      )}
    </article>
  );
}

export default function TherapistsPage() {
  const router = useRouter();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ticketNotice, setTicketNotice] = useState("");
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [hasActive, setHasActive] = useState(hasPurchasedTicket());
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function loadTherapists() {
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ query: therapistQuery }),
        });
        const result = await response.json();

        if (!response.ok || result.errors) throw new Error("Unable to load therapists");
        setTherapists(result.data?.therapists?.data?.therapists ?? []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTherapists();
  }, []);

  const featuredTherapists = useMemo(() => therapists.slice(0, 5), [therapists]);
  const activeTherapist = featuredTherapists[activeSlide];
  const startPayment = async (therapistId) => {
    const token = localStorage.getItem("authToken");
    setTicketNotice("");
    setIsStartingPayment(true);
    try {
      const response = await fetch("http://localhost:4000/graphql", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ query: "mutation StartPayment($input: InitiateConsultationPaymentInput!) { initiateConsultationPayment(input: $input) { message data { paymentUrl } } }", variables: { input: { therapistId } } }) });
      const result = await response.json();
      const paymentUrl = result.data?.initiateConsultationPayment?.data?.paymentUrl;
      if (!response.ok || result.errors || !paymentUrl) throw new Error("Payment could not be started");
      window.location.assign(paymentUrl);
    } catch {
      setTicketNotice("Unable to start payment right now. Please try again later.");
      setIsStartingPayment(false);
    }
  };

  const startCall = async (therapistId) => {
    const token = localStorage.getItem("authToken");
    setTicketNotice("");
    setIsStartingCall(true);
    try {
      const response = await fetch("http://localhost:4000/api/video/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ therapistId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not start the call.");

      const therapist = therapists.find((item) => item.id === therapistId);
      saveCallSession({
        callId: result.data.callId,
        apiKey: result.data.apiKey,
        token: result.data.token,
        streamId: result.data.patientStreamId,
        name: therapist?.name || "CalmSpace",
      });
      consumeActiveTicket();
      setHasActive(false);
      router.push(`/video/${result.data.callId}`);
    } catch (err) {
      setTicketNotice(err?.message || "Could not start the call. Please try again later.");
    } finally {
      setIsStartingCall(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Consultation support</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">Find the Right Therapist for You</h1>
        <p className="mt-3 leading-7 text-slate-600">Explore our available therapists and find a professional who can provide the support you are looking for.</p>
      </header>

      {hasActive && (
        <p className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
          Your consultation ticket is confirmed — you can now call any available therapist from the list below whenever you feel ready. The ticket can be used once.
        </p>
      )}
      {!hasActive && (
        <p className="mt-6 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          Buy one ticket to call any therapist of your choice. Each ticket can be used for a single consultation with any available therapist.
        </p>
      )}

      {loading && <p className="mt-10 rounded-xl bg-white p-6 text-center font-medium text-slate-600 shadow-sm">Loading therapists...</p>}
      {error && <p className="mt-10 rounded-xl border border-rose-100 bg-rose-50 p-6 text-center font-medium text-rose-700">Unable to load therapists right now. Please try again later.</p>}
      {!loading && !error && therapists.length === 0 && <p className="mt-10 rounded-xl bg-white p-6 text-center font-medium text-slate-600 shadow-sm">No therapists are currently available.</p>}

      {!loading && !error && therapists.length > 0 && (
        <>
          <section className="mt-10" aria-labelledby="featured-therapists">
            <div className="flex items-center justify-between gap-4"><h2 id="featured-therapists" className="text-2xl font-bold text-slate-800">Featured Therapists</h2><div className="flex gap-2"><button type="button" aria-label="Previous therapist" onClick={() => setActiveSlide((activeSlide - 1 + featuredTherapists.length) % featuredTherapists.length)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><ChevronLeft size={20} /></button><button type="button" aria-label="Next therapist" onClick={() => setActiveSlide((activeSlide + 1) % featuredTherapists.length)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><ChevronRight size={20} /></button></div></div>
            <div className="mt-5 max-w-md">{activeTherapist && <TherapistCard therapist={activeTherapist} onBuyTicket={startPayment} onMakeCall={startCall} hasActive={hasActive} isStartingPayment={isStartingPayment} isStartingCall={isStartingCall} />}</div>
          </section>
          {ticketNotice && <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800" role="status">{ticketNotice}</p>}
          <section className="mt-12" aria-labelledby="all-therapists"><h2 id="all-therapists" className="text-2xl font-bold text-slate-800">All Therapists</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{therapists.map((therapist) => <TherapistCard key={therapist.id} therapist={therapist} onBuyTicket={startPayment} onMakeCall={startCall} hasActive={hasActive} isStartingPayment={isStartingPayment} isStartingCall={isStartingCall} />)}</div></section>
        </>
      )}
    </main>
  );
}
