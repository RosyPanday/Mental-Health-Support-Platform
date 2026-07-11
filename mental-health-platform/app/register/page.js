"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Backend logic yaha connect hunxa paxi
    alert(`Registration triggered for username: ${formData.username}`);
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Create Anonymous Account</h2>
      <p className="text-xs text-slate-400 text-center mb-6">Choose a unique avatar/username. No real email or name required.</p>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Anonymous Username</label>
          <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., lone_wolf44" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
          <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
          <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all text-sm mt-2">
          Sign Up
        </button>
      </form>
      <p className="text-xs text-center text-slate-500 mt-4">
        Already have an account? <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
}