"use client";
import { useState } from 'react';

export default function ForumFeed() {
  const [posts, setPosts] = useState([
    { id: 1, text: "Exams ko stress le garda raati nindra lagna chhadiskyo. Anyone else?", date: "2026-07-11" },
    { id: 2, text: "Anonymous bhayera kura thali sakda man dherai halka hudo raixa.", date: "2026-07-10" }
  ]);
  const [input, setInput] = useState("");

  const pushPost = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const item = { id: Date.now(), text: input, date: new Date().toISOString().split('T')[0] };
    setPosts([item, ...posts]);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto my-6 px-4">
      <form onSubmit={pushPost} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24" placeholder="Share your mind anonymously..." />
        <button type="submit" className="mt-2 bg-emerald-600 text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-emerald-700 float-right">Publish Anonymously</button>
        <div className="clear-both"></div>
      </form>

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium text-emerald-600">👤 Anonymous Peer</span>
              <span>{p.date}</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}