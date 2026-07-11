import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="max-w-3xl mx-auto my-20 text-center px-4">
      <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4">
        Your Safe, Anonymous <br/><span className="text-emerald-600">Mental Health Space</span>
      </h1>
      <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
        Share your inner thoughts without judgment, assess your current wellness levels, and connect with peers securely.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md">
          Enter Community Forum
        </Link>
        <Link href="/quiz" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl transition-all shadow-xs">
          Take Diagnostic Quiz
        </Link>
      </div>
    </div>
  );
}