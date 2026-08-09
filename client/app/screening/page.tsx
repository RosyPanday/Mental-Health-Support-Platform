"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPurchasedTicket } from "@/lib/tickets";

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking slowly, or being very restless",
  "Thoughts that you would be better off dead or hurting yourself",
];

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function PHQ9Screening() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(9).fill(null),
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const [result, setResult] = useState<{
    message: string;
    totalScore: number;
    severity: string;
  } | null>(null);

  useEffect(() => {
    if (hasPurchasedTicket()) {
      router.replace("/therapists");
    }
  }, [router]);

  const setAnswer = (index: number, value: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (answers.includes(null)) {
      setMessage("Please answer all 9 questions.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation SubmitPHQ9($input: phqNineScreeningInput) {
              phqNineScreening(input: $input) {
                message
                data {
                  totalScore
                  severity
                }
              }
            }
          `,
          variables: {
            input: { responses: answers },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setMessage(result.errors[0].message);
        return;
      }

      const saved = result.data.phqNineScreening;
      setResult({
        message: saved.message,
        totalScore: saved.data.totalScore,
        severity: saved.data.severity,
      });
    } catch {
      setMessage("Could not save your screening. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">PHQ-9 Depression Screening</h1>
      <p className="mb-6 text-slate-600">
        Over the last two weeks, how often have you been bothered by these problems?
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <section key={question} className="bg-white border rounded-xl p-5">
            <p className="font-medium mb-3">
              {index + 1}. {question}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((option) => (
                <label key={option.value} className="border rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    checked={answers[index] === option.value}
                    onChange={() => setAnswer(index, option.value)}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </section>
        ))}

        {message && <p className="text-center text-sm font-medium">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Submit Screening"}
        </button>
      </form>

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="screening-result-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Your consultation check-in</p>
            <h2 id="screening-result-title" className="mt-2 text-2xl font-bold text-slate-800">Screening Result</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Score</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{result.totalScore}</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Severity</p>
                <p className="mt-1 text-lg font-bold capitalize text-slate-800">{result.severity}</p>
              </div>
            </div>
            <p className="mt-5 leading-6 text-slate-600">{result.message}</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setResult(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Go Back</button>
              <button type="button" onClick={() => router.push("/therapists")} className="rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700">Call Therapist</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
