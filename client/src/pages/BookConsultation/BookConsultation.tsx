import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { BASE_URL } from "../../api/restClient";
import defaultProfile from "../../assets/default-profile.png";
import PatientShell from "../../components/PatientShell/PatientShell";
import type { IconProps } from "../../interfaces/components";
import type { TherapistRecommendation } from "../../interfaces/consultation";
import {
  requestConsultation,
  searchTherapists,
} from "../../services/consultationService";
import type { ConsultationTimeFormValues, TherapistSearchFormValues } from "../../types/forms";
import type { BookConsultationIconName } from "../../types/icons";
import { consultationTimeSchema, therapistSearchSchema } from "../../validation/formSchemas";

import "./BookConsultation.css";

function Icon({ name }: IconProps<BookConsultationIconName>) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

  if (name === "back") return <svg {...props}><path d="M19 12H5m6-6-6 6 6 6" /></svg>;
  if (name === "search") return <svg {...props}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
  if (name === "person") return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4.5 21c.7-4.5 3.2-7 7.5-7s6.8 2.5 7.5 7" /></svg>;
  if (name === "calendar") return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4m8-4v4M3 10h18" /></svg>;
  return <svg {...props}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
}

function getLocalDateTimeMinimum() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function getProfileUrl(path?: string) {
  if (!path) return defaultProfile;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function BookConsultation() {
  const [therapists, setTherapists] = useState<TherapistRecommendation[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistRecommendation | null>(null);
  const [searched, setSearched] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    formState: { errors: searchErrors, isSubmitting: searching },
    handleSubmit: handleSearchSubmit,
    register: registerSearch,
    watch: watchSearch,
  } = useForm<TherapistSearchFormValues>({
    resolver: yupResolver(therapistSearchSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { description: "" },
  });

  const {
    clearErrors: clearScheduleErrors,
    formState: { errors: scheduleErrors, isSubmitting: requesting },
    handleSubmit: handleScheduleSubmit,
    register: registerSchedule,
    reset: resetSchedule,
  } = useForm<ConsultationTimeFormValues>({
    resolver: yupResolver(consultationTimeSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { preferredTime: "" },
  });

  const description = watchSearch("description") || "";

  const handleSearch = async (values: TherapistSearchFormValues) => {
    try {
      setApiError("");
      setSuccess("");
      setSelectedTherapist(null);
      resetSchedule({ preferredTime: "" });
      const result = await searchTherapists(values.description);
      setTherapists(result);
      setSearched(true);
    } catch (error) {
      console.error(error);
      setApiError("We could not find therapists right now. Please try again.");
    }
  };

  const handleRequest = async (values: ConsultationTimeFormValues) => {
    if (!selectedTherapist) {
      setApiError("Choose a therapist before requesting a consultation time.");
      return;
    }

    try {
      setApiError("");
      await requestConsultation(
        selectedTherapist.therapist.id,
        new Date(values.preferredTime).toISOString(),
      );
      setSuccess(
        `Your consultation request with ${selectedTherapist.therapist.name} has been sent.`,
      );
      setSelectedTherapist(null);
      resetSchedule({ preferredTime: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setApiError("We could not send your request. Please review the time and try again.");
    }
  };

  const selectTherapist = (therapist: TherapistRecommendation) => {
    setSelectedTherapist(therapist);
    setApiError("");
    clearScheduleErrors();
    resetSchedule({ preferredTime: "" });
  };

  return (
    <PatientShell>
      <main className="patient-page-shell booking-detail">
        <header className="patient-page-header">
          <div className="patient-page-header__copy">
            <p className="patient-page-eyebrow">Professional support</p>
            <h1>Find a therapist</h1>
            <p>
              Tell us what you would like help with. We will show relevant
              therapists so you can choose who feels like the best fit.
            </p>
          </div>
          <Link to="/patient-dashboard" className="patient-back-link">
            <Icon name="back" /> Back to overview
          </Link>
        </header>

        {success && (
          <section className="booking-detail__success" role="status">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Request sent</strong>
              <p>{success}</p>
            </div>
            <Link to="/pending-consultations">Track request <Icon name="arrow" /></Link>
          </section>
        )}

        <ol className="booking-detail__steps" aria-label="Booking steps">
          <li className="booking-detail__step--active"><span>01</span><div><strong>Share your needs</strong><small>Describe the support you want</small></div></li>
          <li className={searched ? "booking-detail__step--active" : ""}><span>02</span><div><strong>Choose a therapist</strong><small>Compare relevant profiles</small></div></li>
          <li className={selectedTherapist ? "booking-detail__step--active" : ""}><span>03</span><div><strong>Request a time</strong><small>Send your preferred schedule</small></div></li>
        </ol>

        <form
          className="booking-detail__search"
          aria-labelledby="therapist-search-title"
          onSubmit={handleSearchSubmit(handleSearch)}
          noValidate
        >
          <div className="booking-detail__search-heading">
            <span><Icon name="search" /></span>
            <div>
              <h2 id="therapist-search-title">What kind of support are you looking for?</h2>
              <p>You can mention what you have been feeling or a topic you want to work through.</p>
            </div>
          </div>

          <label htmlFor="support-description">Describe what is on your mind</label>
          <textarea
            id="support-description"
            placeholder="For example: I have been feeling anxious and would like help managing stress at work."
            maxLength={600}
            aria-invalid={searchErrors.description ? "true" : undefined}
            aria-describedby={searchErrors.description ? "support-description-error" : undefined}
            {...registerSearch("description", { onChange: () => setApiError("") })}
          />
          {searchErrors.description?.message && (
            <p className="booking-detail__field-error" id="support-description-error" role="alert">
              {searchErrors.description.message}
            </p>
          )}
          <div className="booking-detail__search-footer">
            <span>{description.length}/600 characters</span>
            <button type="submit" disabled={searching}>
              <Icon name="search" /> {searching ? "Finding therapists…" : "Find therapists"}
            </button>
          </div>
        </form>

        {apiError && <p className="booking-detail__error" role="alert">{apiError}</p>}

        {searched && (
          <section className="booking-detail__results" aria-labelledby="therapist-results-title">
            <div className="booking-detail__results-heading">
              <div>
                <p className="patient-page-eyebrow">Suggested for you</p>
                <h2 id="therapist-results-title">Therapists to explore</h2>
              </div>
              <span>{therapists.length} {therapists.length === 1 ? "profile" : "profiles"}</span>
            </div>

            {therapists.length === 0 ? (
              <div className="booking-detail__empty">
                <span><Icon name="person" /></span>
                <h3>No matching therapists found</h3>
                <p>Try describing your needs in a different way or include the area of support you want.</p>
              </div>
            ) : (
              <div className="booking-detail__therapist-grid">
                {therapists.map((therapist) => {
                  const { therapist: profile, similarityPercentage } = therapist;
                  const isSelected = selectedTherapist?.therapist.id === profile.id;
                  return (
                    <article className={`booking-detail__therapist${isSelected ? " booking-detail__therapist--selected" : ""}`} key={profile.id}>
                      <div className="booking-detail__therapist-header">
                        <img src={getProfileUrl(profile.profilePic)} alt={profile.name} />
                        <div>
                          <h3>{profile.name}</h3>
                          <p>{profile.specialization || "Mental health therapist"}</p>
                        </div>
                        <span className="booking-detail__match-score">{similarityPercentage}% match</span>
                      </div>
                      <dl>
                        <div><dt>Experience</dt><dd>{profile.yearsOfExperience} years</dd></div>
                        <div><dt>Language</dt><dd>{profile.language || "Not provided"}</dd></div>
                      </dl>
                      <button type="button" onClick={() => selectTherapist(therapist)}>
                        {isSelected ? "Selected" : "Choose therapist"}
                        {!isSelected && <Icon name="arrow" />}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {selectedTherapist && (
          <section className="booking-detail__schedule" aria-labelledby="schedule-title">
            <div className="booking-detail__schedule-person">
              <img src={getProfileUrl(selectedTherapist.therapist.profilePic)} alt="" />
              <div>
                <p className="patient-page-eyebrow">Your selection</p>
                <h2 id="schedule-title">Request a time with {selectedTherapist.therapist.name}</h2>
                <span>{selectedTherapist.therapist.specialization} · {selectedTherapist.therapist.language}</span>
              </div>
            </div>
            <form
              className="booking-detail__schedule-form"
              onSubmit={handleScheduleSubmit(handleRequest)}
              noValidate
            >
              <label htmlFor="preferred-time">Preferred consultation time</label>
              <div className={scheduleErrors.preferredTime ? "booking-detail__input--invalid" : undefined}>
                <span><Icon name="calendar" /></span>
                <input
                  id="preferred-time"
                  type="datetime-local"
                  min={getLocalDateTimeMinimum()}
                  aria-invalid={scheduleErrors.preferredTime ? "true" : undefined}
                  aria-describedby={scheduleErrors.preferredTime ? "preferred-time-error" : "preferred-time-hint"}
                  {...registerSchedule("preferredTime", { onChange: () => setApiError("") })}
                />
              </div>
              {scheduleErrors.preferredTime?.message && (
                <p className="booking-detail__field-error booking-detail__field-error--dark" id="preferred-time-error" role="alert">
                  {scheduleErrors.preferredTime.message}
                </p>
              )}
              <small id="preferred-time-hint">The therapist will review and confirm your requested time.</small>
              <button type="submit" disabled={requesting}>
                {requesting ? "Sending request…" : "Send consultation request"}
              </button>
            </form>
          </section>
        )}

        <aside className="patient-safety-note">
          <span className="patient-safety-note__icon" aria-hidden="true">!</span>
          <p><strong>Need immediate help?</strong> Therapist matching and consultation requests are not emergency services. If you are in immediate danger, contact local emergency services or a trusted person nearby.</p>
        </aside>
      </main>
    </PatientShell>
  );
}
