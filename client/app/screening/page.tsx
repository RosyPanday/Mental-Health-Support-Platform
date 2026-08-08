"use client";

import { useState } from "react";

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
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(9).fill(null),
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      setMessage(
        `${saved.message} Score: ${saved.data.totalScore}, Severity: ${saved.data.severity}`,
      );
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
    </main>
  );
}