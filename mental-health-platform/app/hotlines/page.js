export default function SafeHotlines() {
  const directList = [
    { source: "National Mental Health Helpline", number: "1166", shift: "24 Hours Toll-Free" },
    { source: "Patan Hospital Mental Health Hotline", number: "9813473535", shift: "Emergency Emergency Contact" },
    { source: "TPO Nepal Psychosocial Support Center", number: "16600102005", shift: "Standard Office Hours" }
  ];

  return (
    <div className="max-w-xl mx-auto my-10 px-4">
      <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl mb-6 text-center">
        <h2 className="text-xl font-bold text-rose-600 mb-1">Emergency Crisis Line</h2>
        <p className="text-xs text-slate-500">If you are facing an extreme emotional breakdown, feel free to call instantly.</p>
      </div>
      <div className="space-y-3">
        {directList.map((hl, i) => (
          <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl flex justify-between items-center shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-800">{hl.source}</h4>
              <p className="text-xs text-slate-400">{hl.shift}</p>
            </div>
            <a href={`tel:${hl.number}`} className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm">
              📞 CALL {hl.number}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}