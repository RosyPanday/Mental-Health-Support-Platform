"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Backend JWT Login logic yaha connect hunxa
    alert(`Logging in as: ${formData.username}`);
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Welcome Back</h2>
      <p className="text-xs text-slate-400 text-center mb-6">Enter your anonymous credentials to log in.</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
          <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="your anonymous username" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
          <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all text-sm mt-2">
          Sign In
        </button>
      </form>
      <p className="text-xs text-center text-slate-500 mt-4">
        Don't have an account? <Link href="/register" className="text-emerald-600 font-semibold hover:underline">Register</Link>
      </p>
    </div>
  );
}