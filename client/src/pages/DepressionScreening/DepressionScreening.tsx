import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import PatientShell from "../../components/PatientShell/PatientShell";
import { phq9Questions } from "../../data/phq9Questions";
import type { ScreeningResult } from "../../interfaces/phq";
import { submitPhqScreening } from "../../services/phqService";
import type { ScreeningFormValues } from "../../types/forms";
import { screeningSchema } from "../../validation/formSchemas";

import "./DepressionScreening.css";

const options = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5m6-6-6 6 6 6" />
    </svg>
  );
}

export default function DepressionScreening() {
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [apiError, setApiError] = useState("");
  const {
    formState: { errors, isSubmitted, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<ScreeningFormValues>({
    resolver: yupResolver(screeningSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      responses: Array(phq9Questions.length).fill(-1),
    },
  });

  const responses = watch("responses") || [];
  const answeredCount = responses.filter(
    (score) => Number.isInteger(score) && score >= 0 && score <= 3,
  ).length;
  const progress = (answeredCount / phq9Questions.length) * 100;

  const submitScreening = async (values: ScreeningFormValues) => {
    try {
      setApiError("");
      const response = await submitPhqScreening(values.responses);
      setResult(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setApiError("We could not submit your check-in. Please try again.");
    }
  };

  const resetScreening = () => {
    reset({ responses: Array(phq9Questions.length).fill(-1) });
    setResult(null);
    setApiError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PatientShell>
      <main className="patient-page-shell screening-detail">
        <header className="patient-page-header">
          <div className="patient-page-header__copy">
            <p className="patient-page-eyebrow">Guided self-reflection</p>
            <h1>Wellbeing checking</h1>
            <p>
              Reflect on how often each experience has affected you during the
              last two weeks. Choose the response that feels most accurate.
            </p>
          </div>
          <Link to="/patient-dashboard" className="patient-back-link">
            <BackArrow /> Back to overview
          </Link>
        </header>

        <section className="screening-detail__notice" aria-label="Screening disclaimer">
          <span aria-hidden="true">i</span>
          <p>
            <strong>This is an informational PHQ-9 screening.</strong> It is not a
            diagnosis and does not replace medical advice, professional care, or
            clinical judgment.
          </p>
        </section>

        {result ? (
          <section className="screening-detail__result" aria-live="polite">
            <div className="screening-detail__score">
              <span>Your score</span>
              <strong>{result.data.totalScore}</strong>
              <small>out of 27</small>
            </div>
            <div className="screening-detail__result-copy">
              <p className="patient-page-eyebrow">Check-in complete</p>
              <h2>Thank you for taking time to reflect.</h2>
              <p>{result.message}</p>
              <p className="screening-detail__result-note">
                Consider discussing your responses with a qualified mental health
                professional, especially if these experiences are affecting daily life.
              </p>
              <div className="screening-detail__result-actions">
                <Link to="/book-consultation">Find a therapist</Link>
                <button type="button" onClick={resetScreening}>Retake check-in</button>
              </div>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit(submitScreening)} noValidate>
            <div className="screening-detail__progress-wrap">
              <div className="screening-detail__progress-label">
                <span>Your progress</span>
                <strong>{answeredCount} of {phq9Questions.length} answered</strong>
              </div>
              <div className="screening-detail__progress" role="progressbar" aria-valuemin={0} aria-valuemax={phq9Questions.length} aria-valuenow={answeredCount}>
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="screening-detail__questions">
              {phq9Questions.map((item, index) => (
                <fieldset
                  className={`screening-question${errors.responses?.[index] ? " screening-question--invalid" : ""}`}
                  key={item.id}
                >
                  <legend>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.question}
                  </legend>

                  <div className="screening-question__options">
                    {options.map((option) => (
                      <label key={option.score}>
                        <input
                          type="radio"
                          value={option.score}
                          aria-invalid={errors.responses?.[index] ? "true" : undefined}
                          aria-describedby={errors.responses?.[index] ? `question-${item.id}-error` : undefined}
                          {...register(`responses.${index}`, {
                            valueAsNumber: true,
                            onChange: () => setApiError(""),
                          })}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.responses?.[index]?.message && (
                    <p className="screening-question__error" id={`question-${item.id}-error`} role="alert">
                      {errors.responses[index]?.message}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>

            {isSubmitted && answeredCount !== phq9Questions.length && (
              <p className="screening-detail__error" role="alert">
                Please answer all questions. You have {phq9Questions.length - answeredCount} remaining.
              </p>
            )}

            {apiError && <p className="screening-detail__error" role="alert">{apiError}</p>}

            <div className="screening-detail__submit-wrap">
              <div>
                <strong>{answeredCount === phq9Questions.length ? "You are ready to submit" : "Complete every question to continue"}</strong>
                <span>Your responses can be changed until you submit.</span>
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "View my result"}
              </button>
            </div>
          </form>
        )}

        <aside className="patient-safety-note">
          <span className="patient-safety-note__icon" aria-hidden="true">!</span>
          <p><strong>If this check-in raises immediate safety concerns,</strong> contact local emergency services or a trusted person who can stay with you. This platform is not an emergency service.</p>
        </aside>
      </main>
    </PatientShell>
  );
}
