"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Hourglass, PhoneCall, PhoneOff, UploadCloud } from "lucide-react";
import { isAuthenticatedTherapist, useIsAuthenticatedTherapist } from "@/lib/auth";
import { endVideoCall, fetchActiveCalls, prepareCallSession, startHeartbeat } from "@/lib/video";
import { playRingTone, stopRingTone } from "@/lib/ringTone";

const profileQuery = `
  query TherapistProfile {
    therapistProfile {
      data {
        therapist {
          id
          name
          specialization
          educationDegree
          yearsOfExperience
          language
          review
          isVerified
        }
      }
    }
  }
`;

const detailItems = (p) => [
  { label: "Qualification", value: p?.educationDegree },
  { label: "Specialization", value: p?.specialization },
  { label: "Experience", value: p?.yearsOfExperience != null ? `${p.yearsOfExperience} years` : null },
  { label: "Language", value: p?.language },
  { label: "Rating", value: p?.review ? `${Number(p.review).toFixed(1)} / 5` : "No reviews yet" },
];

export default function TherapistDashboard() {
  const router = useRouter();
  const isTherapist = useIsAuthenticatedTherapist();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  const answerCall = useCallback(async (call) => {
    stopRingTone();
    try {
      await prepareCallSession(call.callId);
      router.push(`/video/${call.callId}`);
    } catch {
      setIncomingCall(null);
    }
  }, [router]);

  const declineCall = useCallback(async (call) => {
    stopRingTone();
    setIncomingCall(null);
    try {
      await endVideoCall(call.callId);
    } catch {}
  }, []);

  useEffect(() => {
    if (!isAuthenticatedTherapist()) return;

    const stopHeartbeat = startHeartbeat();
    let cancelled = false;

    async function pollCalls() {
      try {
        const active = await fetchActiveCalls();
        if (cancelled) return;
        if (active?.callId) {
          setIncomingCall((current) => {
            if (current?.callId === active.callId) return current;
            playRingTone();
            return active;
          });
        } else {
          setIncomingCall((current) => {
            if (current) stopRingTone();
            return null;
          });
        }
      } catch {}
    }

    pollCalls();
    const interval = setInterval(pollCalls, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      stopHeartbeat();
      stopRingTone();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticatedTherapist()) {
      router.replace("/login");
      return;
    }

    const token = localStorage.getItem("authToken");

    async function loadProfile() {
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ query: profileQuery }),
        });
        const result = await response.json();
        if (!response.ok || result.errors) throw new Error("Unable to load profile");
        setProfile(result.data?.therapistProfile?.data?.therapist ?? null);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (!isTherapist) return null;

  const firstName = profile?.name?.split(" ")[0] ?? "";

  return (
    <>
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Therapist space</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          {loading || error || !profile ? "Welcome back" : `Welcome, ${firstName}`}
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Manage your profile, verification documents, and availability from this space.
        </p>
      </header>

      {loading && <p className="mt-10 rounded-xl bg-white p-6 text-center font-medium text-slate-600 shadow-sm">Loading your profile...</p>}

      {!loading && error && <p className="mt-10 rounded-xl border border-rose-100 bg-rose-50 p-6 text-center font-medium text-rose-700">Unable to load your profile right now. Please try again later.</p>}

      {!loading && !error && profile && (
        <>
          <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 sm:flex-row sm:items-center">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold ${profile.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                {profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "TP"}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                <p className="text-sm text-slate-600">{profile.specialization || "Therapist"}</p>
              </div>
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${profile.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {profile.isVerified ? <BadgeCheck size={14} /> : <Hourglass size={14} />}
                {profile.isVerified ? "Verified" : "Verification pending"}
              </span>
            </div>

            <dl className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {detailItems(profile)
                .filter((item) => item.value != null && item.value !== "")
                .map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</dt>
                    <dd className="mt-1 font-medium text-slate-800">{item.value}</dd>
                  </div>
                ))}
            </dl>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            {profile.isVerified ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">You are ready to take consultations</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Patients who buy a ticket can choose you from the therapist list and give you a call.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Finish your verification</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Upload your profile picture and documents so patients can book you for consultations.
                  </p>
                </div>
                <Link href="/therapist/documents" className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                  <UploadCloud size={16} />
                  Upload documents
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </main>
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="incoming-call-title" className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Incoming consultation</p>
            <h2 id="incoming-call-title" className="mt-2 text-xl font-bold text-slate-800">A patient is calling you</h2>
            <p className="mt-2 text-sm text-slate-500">Accept the call to start the consultation.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button type="button" onClick={() => declineCall(incomingCall)} className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 font-semibold text-white hover:bg-rose-700">
                <PhoneOff size={17} /> Decline
              </button>
              <button type="button" onClick={() => answerCall(incomingCall)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">
                <PhoneCall size={17} /> Answer
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}