"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, HeartHandshake, MessageCircle, Phone } from "lucide-react";
import { isAuthenticatedClient, useIsAuthenticatedClient } from "@/lib/auth";
import { hasPurchasedTicket } from "@/lib/tickets";

const supportOptions = [
  {
    title: "Consultation",
    description: "Start a private PHQ-9 self-assessment when you feel ready. It is a helpful check-in, not a diagnosis.",
    href: "/screening",
    icon: HeartHandshake,
    action: "Begin consultation",
    primary: true,
  },
  {
    title: "Self-Check",
    description: "Take a moment to reflect on your current wellbeing with the existing self-check.",
    href: "/quiz",
    icon: ClipboardList,
    action: "Open self-check",
  },
  {
    title: "Helpline",
    description: "Find mental-health support contacts when you need immediate guidance.",
    href: "/hotlines",
    icon: Phone,
    action: "View helplines",
  },
  {
    title: "Forum",
    description: "Connect with the community and share your thoughts anonymously.",
    href: "/dashboard",
    icon: MessageCircle,
    action: "Visit forum",
  },
];

export default function ClientHomePage() {
  const router = useRouter();
  const isClient = useIsAuthenticatedClient();

  useEffect(() => {
    if (!isAuthenticatedClient()) {
      router.replace("/login");
    }
  }, [router]);

  if (!isClient) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-10 shadow-sm sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Your wellbeing space</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">Welcome to CalmSpace</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Take things at your own pace. CalmSpace gives you a supportive place to check in, find resources, and connect with others.
        </p>
        <Link href={hasPurchasedTicket() ? "/therapists" : "/screening"} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
          <HeartHandshake size={19} />
          {hasPurchasedTicket() ? "Go to a therapist" : "Start a consultation"}
        </Link>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">How can we support you today?</h2>
          <p className="mt-1 text-slate-500">Choose the support that feels most useful right now.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {supportOptions.map(({ title, description, href, icon: Icon, action, primary }) => {
            const purchased = primary && hasPurchasedTicket();
            const cardHref = purchased ? "/therapists" : href;
            return (
            <article key={title} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${primary ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-800">{title}</h3>
              <p className="mt-2 flex-1 leading-6 text-slate-600">{description}</p>
              <Link href={cardHref} className={`mt-5 inline-flex w-fit rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${primary ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                {purchased ? "Choose your therapist" : action}
              </Link>
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
