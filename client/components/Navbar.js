import Link from "next/link";
import {
  Leaf,
  MessageCircle,
  ClipboardList,
  Phone,
  UserPlus,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-100 py-4 px-8 flex justify-between items-center shadow-sm">

      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-emerald-600"
      >
        <Leaf size={28} />
        CalmSpace
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">

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

        <Link
          href="/register"
          className="flex items-center gap-2 border border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg"
        >
          <UserPlus size={18}/>
          Register
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          <LogIn size={18}/>
          Login
        </Link>

      </div>

    </nav>
  );
}