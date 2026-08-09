"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  MessageCircle,
  ClipboardList,
  Phone,
  HeartHandshake,
  UserPlus,
  LogIn,
  LogOut,
} from "lucide-react";
import { clearAuthSession, useIsAuthenticatedClient, useIsAuthenticatedTherapist } from "@/lib/auth";
import { hasPurchasedTicket } from "@/lib/tickets";

export default function Navbar() {
  const router = useRouter();
  const isClient = useIsAuthenticatedClient();
  const isTherapist = useIsAuthenticatedTherapist();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-4 py-4 shadow-sm sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">

      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-emerald-600"
      >
        <Leaf size={28} />
        CalmSpace
      </Link>

      <div className="flex flex-wrap items-center justify-end gap-3 text-sm font-medium text-slate-600 sm:gap-6">

        <Link href="/dashboard" className="flex items-center gap-2 hover:text-emerald-600">
          <MessageCircle size={18}/>
          Forum
        </Link>

        <Link href="/quiz" className="flex items-center gap-2 hover:text-emerald-600">
          <ClipboardList size={18}/>
          Self-Check
        </Link>

        <Link href="/hotlines" className="flex items-center gap-2 text-rose-500">
          <Phone size={18}/>
          Helpline
        </Link>

{isClient && (
          <>
            <Link href={hasPurchasedTicket() ? "/therapists" : "/screening"} className="flex items-center gap-2 hover:text-emerald-600">
              <HeartHandshake size={18}/>
              Consultation
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <LogOut size={18}/>
              Logout
            </button>
          </>
        )}
        {isTherapist && (
          <>
            <Link href="/therapist/dashboard" className="flex items-center gap-2 hover:text-emerald-600">
              <Leaf size={18}/>
              Dashboard
            </Link>
            <Link href="/therapist/documents" className="flex items-center gap-2 hover:text-emerald-600">
              <UserPlus size={18}/>
              Documents
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <LogOut size={18}/>
              Logout
            </button>
          </>
        )}
        {!isClient && !isTherapist && (
          <>
            <Link href="/register" className="flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-emerald-600">
              <UserPlus size={18}/>
              Register
            </Link>
            <Link href="/login" className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white">
              <LogIn size={18}/>
              Login
            </Link>
          </>
        )}

      </div>
      </div>
    </nav>
  );
}
