import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clearAuthCookies, getCookie } from '../utils/auth';

const DashboardPage = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const authRole = getCookie('authRole');
  const authUsername = getCookie('authUsername');
  const effectiveRole = role === 'therapist' || role === 'client' ? role : authRole;

  const greeting = `Hi ${authUsername || 'there'}`;
  const isClient = effectiveRole === 'client';

  const handleLogout = () => {
    clearAuthCookies();
    navigate('/login');
  };

  if (!authUsername || !effectiveRole) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Session expired</h1>
          <p className="text-sm text-slate-600 mb-6">Please log in again to continue accessing your portal.</p>
          <Link
            to="/login"
            className="inline-flex justify-center items-center w-full px-4 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            Login again
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-lg text-slate-900">Wellness Hub</span>
            <nav>
              <Link
                to={isClient ? `/dashboard/client` : `/dashboard/${effectiveRole}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-teal-50 text-teal-700"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 hover:bg-slate-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <span className="text-xs font-semibold tracking-wider text-teal-600 uppercase">Welcome back</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{greeting} 👋</h1>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Depression Screening (PHQ-9)</h2>
              <p className="text-sm text-slate-600">
                Start the depression screening anytime to track progress and get a quick overview of how you're feeling over the last two weeks.
              </p>
            </div>

            {isClient ? (
              <Link
                to="/dashboard/client/screening"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition shadow-sm whitespace-nowrap"
              >
                Open screening
              </Link>
            ) : (
              <div className="bg-blue-50 text-blue-700 text-sm px-4 py-3 rounded-lg border border-blue-100">
                Therapists can view screening reports and support clients from their dashboard.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;