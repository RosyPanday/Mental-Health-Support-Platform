import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-100 py-4 px-8 flex justify-between items-center shadow-xs">
      <Link href="/" className="text-xl font-bold text-emerald-600">🌿 CalmSpace</Link>
      <div className="flex gap-6 font-medium text-slate-600 text-sm">
        <Link href="/dashboard" className="hover:text-emerald-600 transition-all">Forum</Link>
        <Link href="/quiz" className="hover:text-emerald-600 transition-all">Self-Check</Link>
        <Link href="/hotlines" className="text-rose-500 font-semibold hover:text-rose-600">Helpline (1166)</Link>
        <Link href="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-all">Login</Link>
      </div>
    </nav>
  );
}