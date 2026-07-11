"use client";
import { useState } from 'react';

const assessmentQuestions = [
  "I found it difficult to relax or wind down.",
  "I felt down-hearted, sad, or blue.",
  "I felt scared or anxious without any realistic reason.",
  "I found myself getting easily agitated or upset.",
  "I felt that life was completely meaningless right now."
];

export default function QuizInterface() {
  const [metrics, setMetrics] = useState({});
  const [report, setReport] = useState(null);

  const processMetrics = () => {
    const aggregate = Object.values(metrics).reduce((sum, score) => sum + score, 0);
    if (aggregate <= 4) setReport({ type: 'normal', text: 'Normal - You are holding up perfectly well.' });
    else if (aggregate <= 8) setReport({ type: 'warning', text: 'Mild Anxiety/Stress - Consider daily meditation.' });
    else setReport({ type: 'danger', text: '⚠️ Severe Stress - Immediate helpline validation required. Call 1166.' });
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Wellness Diagnostics Matrix</h1>
      <p className="text-slate-400 text-xs mb-6">Select appropriate option matching your clinical state inside this past week.</p>

      {assessmentQuestions.map((qText, idx) => (
        <div key={idx} className="mb-6 border-b border-slate-50 pb-5">
          <p className="text-slate-700 font-medium text-sm mb-3">{idx + 1}. {qText}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Never (0)", "Rarely (1)", "Often (2)", "Always (3)"].map((label, points) => (
              <label key={points} className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg transition-all border border-slate-100">
                <input type="radio" name={`question-${idx}`} value={points} onChange={(e) => setMetrics({ ...metrics, [idx]: parseInt(e.target.value) })} className="accent-emerald-600" />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={processMetrics} disabled={Object.keys(metrics).length !== assessmentQuestions.length} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 transition-all">
        Process Evaluation Report
      </button>

      {report && (
        <div className={`mt-6 p-4 rounded-xl font-semibold text-center text-sm border ${
          report.type === 'normal' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          report.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-rose-50 border-rose-200 text-rose-800 animate-pulse'
        }`}>
          {report.text}
        </div>
      )}
    </div>
  );
}