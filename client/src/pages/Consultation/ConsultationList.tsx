import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";

import { BASE_URL } from "../../api/restClient";
import defaultProfile from "../../assets/default-profile.png";
import PatientShell from "../../components/PatientShell/PatientShell";
import TherapistShell from "../../components/TherapistShell/TherapistShell";
import { useAuth } from "../../context/AuthContext";
import type { IconProps } from "../../interfaces/components";
import type {
  Consultation,
  ConsultationListProps,
  ConsultationPageCopy,
} from "../../interfaces/consultation";
import {
  confirmOrCancelBooking,
  initiateKhaltiPayment,
  joinVideoCall,
  viewConsultations,
} from "../../services/consultationService";
import type { ConsultationDecision, ConsultationStatus } from "../../types/consultation";
import type { CancellationFormValues } from "../../types/forms";
import type { ConsultationIconName } from "../../types/icons";
import { cancellationSchema } from "../../validation/formSchemas";

import "./ConsultationList.css";

const pageCopy: Record<ConsultationStatus, ConsultationPageCopy> = {
  pending: {
    eyebrow: "Awaiting a response",
    title: "Consultation requests",
    description: "Follow the requests you have sent while therapists review your preferred times.",
  },
  confirmed: {
    eyebrow: "Your upcoming care",
    title: "Upcoming consultations",
    description: "Review confirmed session details, payment status, contact information, and joining options.",
  },
  cancelled: {
    eyebrow: "Past updates",
    title: "Consultation history",
    description: "Review requests that were cancelled and any reason that was provided.",
  },
};

const therapistPageCopy: Record<ConsultationStatus, ConsultationPageCopy> = {
  pending: {
    eyebrow: "Awaiting your response",
    title: "New consultation requests",
    description: "Review each client’s preferred time, then confirm the request or provide a clear cancellation reason.",
  },
  confirmed: {
    eyebrow: "Your upcoming practice",
    title: "Confirmed sessions",
    description: "Review session timing and client contact details, and open the video session when it is due.",
  },
  cancelled: {
    eyebrow: "Request history",
    title: "Cancelled consultations",
    description: "Review consultations that did not proceed and the cancellation reason recorded with each request.",
  },
};

const patientEmptyCopy: Record<ConsultationStatus, string> = {
  pending: "When you request a consultation, it will appear here while you wait for a response.",
  confirmed: "Confirmed consultation details will appear here, including payment and joining options.",
  cancelled: "There are no cancelled consultations in your history.",
};

const therapistEmptyCopy: Record<ConsultationStatus, string> = {
  pending: "New client requests will appear here when they are ready for your response.",
  confirmed: "Sessions you confirm will appear here with the client’s contact and joining details.",
  cancelled: "There are no cancelled consultation requests in your history.",
};

function Icon({ name }: IconProps<ConsultationIconName>) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "back") return <svg {...props}><path d="M19 12H5m6-6-6 6 6 6" /></svg>;
  if (name === "calendar") return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4m8-4v4M3 10h18" /></svg>;
  if (name === "clock") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  if (name === "video") return <svg {...props}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>;
  return <svg {...props}><path d="M4 7h16v12H4zM8 4h8v3M8 11h8m-8 4h5" /></svg>;
}

function formatDateTime(value: string) {
  const numericValue = Number(value);
  const date = Number.isNaN(numericValue) ? new Date(value) : new Date(numericValue);

  if (Number.isNaN(date.getTime())) return "Time not available";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function profileUrl(path?: string | null) {
  if (!path) return defaultProfile;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function ConsultationList({ status }: ConsultationListProps) {
  const { user } = useAuth();
  const isPatient = user?.role === "patient";
  const activePageCopy = isPatient ? pageCopy[status] : therapistPageCopy[status];
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedCancelId, setSelectedCancelId] = useState<number | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [actionErrorId, setActionErrorId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const {
    formState: { errors: cancellationErrors, isSubmitting: cancellationSubmitting },
    handleSubmit: handleCancellationSubmit,
    register: registerCancellation,
    reset: resetCancellation,
  } = useForm<CancellationFormValues>({
    resolver: yupResolver(cancellationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { reason: "" },
  });

  const loadConsultations = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await viewConsultations(status);
      setConsultations(data);
    } catch (error) {
      console.error(error);
      setLoadError("We could not load consultations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const handleDecision = async (
    id: number,
    decision: ConsultationDecision,
    cancellationReason?: string,
  ) => {
    try {
      setActionId(id);
      setActionErrorId(null);
      setActionError("");
      await confirmOrCancelBooking(
        id,
        decision,
        decision === "cancelled" ? cancellationReason : undefined,
      );
      setSelectedCancelId(null);
      resetCancellation({ reason: "" });
      await loadConsultations();
    } catch (error) {
      console.error(error);
      setActionError("We could not update this consultation. Please try again.");
      setActionErrorId(id);
    } finally {
      setActionId(null);
    }
  };

  const openCancellation = (id: number) => {
    setSelectedCancelId(id);
    setActionErrorId(null);
    setActionError("");
    resetCancellation({ reason: "" });
  };

  const handleJoinSession = async (consultationId: number) => {
    try {
      setActionId(consultationId);
      setActionErrorId(null);
      setActionError("");
      const response = await joinVideoCall(consultationId);

      if (!response?.data?.meetingLink) {
        setActionError("The session link is not available yet.");
        setActionErrorId(consultationId);
        return;
      }

      window.open(response.data.meetingLink, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      console.error(error);
      setActionError(error?.message || "Unable to join the session right now.");
      setActionErrorId(consultationId);
    } finally {
      setActionId(null);
    }
  };

  const handlePayment = async (consultationId: number) => {
    try {
      setActionId(consultationId);
      setActionErrorId(null);
      setActionError("");
      const response = await initiateKhaltiPayment(consultationId);

      if (!response?.data?.paymentUrl) {
        setActionError("The payment page is not available right now.");
        setActionErrorId(consultationId);
        return;
      }

      window.location.href = response.data.paymentUrl;
    } catch (error: any) {
      console.error(error);
      setActionError(error?.message || "Unable to start payment right now.");
      setActionErrorId(consultationId);
    } finally {
      setActionId(null);
    }
  };

  const content = (
    <main className={`${isPatient ? "patient-page-shell" : "therapist-page-shell"} consultation-detail${isPatient ? "" : " consultation-detail--therapist"}`}>
      <header className={isPatient ? "patient-page-header" : "therapist-page-header"}>
        <div className={isPatient ? "patient-page-header__copy" : "therapist-page-header__copy"}>
          <p className={isPatient ? "patient-page-eyebrow" : "therapist-page-eyebrow"}>{activePageCopy.eyebrow}</p>
          <h1>{activePageCopy.title}</h1>
          <p>{activePageCopy.description}</p>
        </div>
        <Link to={isPatient ? "/patient-dashboard" : "/therapist-dashboard"} className={isPatient ? "patient-back-link" : "therapist-back-link"}>
          <Icon name="back" /> Back to overview
        </Link>
      </header>

      <nav className="consultation-detail__tabs" aria-label="Consultation status">
        {isPatient ? (
          <>
            <NavLink to="/pending-consultations" className={({ isActive }) => isActive ? "consultation-detail__tab--active" : undefined}>Pending</NavLink>
            <NavLink to="/confirmed-consultations" className={({ isActive }) => isActive ? "consultation-detail__tab--active" : undefined}>Confirmed</NavLink>
            <NavLink to="/cancelled-consultations" className={({ isActive }) => isActive ? "consultation-detail__tab--active" : undefined}>Cancelled</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/therapist-pending" className={({ isActive }) => isActive ? "consultation-detail__tab--active" : undefined}>New requests</NavLink>
            <NavLink to="/therapist-confirmed" className={({ isActive }) => isActive ? "consultation-detail__tab--active" : undefined}>Confirmed</NavLink>
            <NavLink to="/therapist-cancelled" className={({ isActive }) => isActive ? "consultation-detail__tab--active" : undefined}>History</NavLink>
          </>
        )}
      </nav>

      {loading ? (
        <div className="consultation-detail__loading" role="status">
          <span />
          <strong>Loading consultations</strong>
          <p>Gathering the latest details from your account…</p>
        </div>
      ) : loadError ? (
        <div className="consultation-detail__empty consultation-detail__empty--error">
          <span><Icon name="empty" /></span>
          <h2>Something went wrong</h2>
          <p>{loadError}</p>
          <button type="button" onClick={loadConsultations}>Try again</button>
        </div>
      ) : consultations.length === 0 ? (
        <div className="consultation-detail__empty">
          <span><Icon name="empty" /></span>
          <h2>No {status} consultations</h2>
          <p>{isPatient ? patientEmptyCopy[status] : therapistEmptyCopy[status]}</p>
          {isPatient && status !== "cancelled" && <Link to="/book-consultation">Find a therapist</Link>}
        </div>
      ) : (
        <div className="consultation-detail__list">
          {consultations.map((consultation) => {
            const therapist = consultation.therapist;
            const paymentStatus = therapist?.payment?.status ?? "PENDING";
            const paymentNeeded = status === "confirmed" && paymentStatus === "PENDING";

            return (
              <article className="consultation-detail__card" key={consultation.id}>
                <div className="consultation-detail__card-top">
                  {isPatient ? (
                    <div className="consultation-detail__person">
                      <img src={profileUrl(therapist?.profilePic)} alt={therapist?.name || "Therapist"} />
                      <div>
                        <div className="consultation-detail__name-row">
                          <h2>{therapist?.name || "Therapist"}</h2>
                          {therapist?.isVerified && <span className="consultation-detail__verified">✓ Verified</span>}
                        </div>
                        <p>{therapist?.specialization || "Mental health therapist"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="consultation-detail__person">
                      <span className="consultation-detail__patient-avatar">{consultation.patient?.name?.charAt(0) || "P"}</span>
                      <div><h2>{consultation.patient?.name || "Patient"}</h2><p>{consultation.patient?.language || "Language not provided"}</p></div>
                    </div>
                  )}
                  <span className={`consultation-detail__status consultation-detail__status--${consultation.status}`}>{consultation.status}</span>
                </div>

                <div className="consultation-detail__schedule-row">
                  <span><Icon name="calendar" /></span>
                  <div><small>Preferred consultation time</small><strong>{formatDateTime(consultation.preferredTime)}</strong></div>
                  <small>Request #{consultation.id}</small>
                </div>

                {isPatient && (
                  <dl className="consultation-detail__facts">
                    <div><dt>Specialization</dt><dd>{therapist?.specialization || "Not provided"}</dd></div>
                    <div><dt>Experience</dt><dd>{therapist?.yearsOfExperience ?? 0} years</dd></div>
                    <div><dt>Language</dt><dd>{therapist?.language || "Not provided"}</dd></div>
                    {status === "confirmed" && <div><dt>Session rate</dt><dd>Rs. {therapist?.rate ?? "—"}</dd></div>}
                  </dl>
                )}

                {status === "confirmed" && (
                  <div className="consultation-detail__confirmed-grid">
                    <section>
                      <p className="consultation-detail__section-label">Contact information</p>
                      <div className="consultation-detail__contact">
                        <span><small>Email</small><strong>{isPatient ? therapist?.user?.email || "Not provided" : consultation.patient?.user?.email || "Not provided"}</strong></span>
                        <span><small>Phone</small><strong>{isPatient ? therapist?.user?.phoneNumber || "Not provided" : consultation.patient?.user?.phoneNumber || "Not provided"}</strong></span>
                        {!isPatient && consultation.patient?.age != null && (
                          <span><small>Age</small><strong>{consultation.patient.age}</strong></span>
                        )}
                        {!isPatient && consultation.patient?.issues && consultation.patient.issues.trim() && (
                          <span><small>Issues</small><strong>{consultation.patient.issues}</strong></span>
                        )}
                      </div>
                    </section>
                    {isPatient && (
                      <section>
                        <p className="consultation-detail__section-label">Payment</p>
                        <div className="consultation-detail__payment">
                          <span className={`consultation-detail__payment-status consultation-detail__payment-status--${paymentStatus.toLowerCase()}`}>{paymentStatus}</span>
                          <p>{paymentNeeded ? "Payment is required before joining the session." : "Your latest payment status is shown above."}</p>
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {status === "cancelled" && (
                  <div className="consultation-detail__reason">
                    <span aria-hidden="true">i</span>
                    <div>
                      <strong>Cancellation reason</strong>
                      <p>{consultation.reason || "No reason was provided."}</p>
                    </div>
                  </div>
                )}

                {status === "confirmed" && (
                  <div className="consultation-detail__actions">
                    {isPatient && paymentNeeded && (
                      <button type="button" className="consultation-detail__pay" onClick={() => handlePayment(consultation.id)} disabled={actionId === consultation.id}>Pay with Khalti</button>
                    )}
                    <button type="button" className="consultation-detail__join" onClick={() => handleJoinSession(consultation.id)} disabled={actionId === consultation.id}>
                      <Icon name="video" /> {actionId === consultation.id ? "Please wait…" : "Join video session"}
                    </button>
                  </div>
                )}

                {!isPatient && status === "pending" && (
                  <div className="consultation-detail__actions">
                    <button type="button" className="consultation-detail__join" onClick={() => handleDecision(consultation.id, "confirmed")} disabled={actionId === consultation.id}>Confirm request</button>
                    <button type="button" className="consultation-detail__secondary" onClick={() => openCancellation(consultation.id)}>Cancel request</button>
                  </div>
                )}

                {selectedCancelId === consultation.id && (
                  <form
                    className="consultation-detail__cancel-form"
                    onSubmit={handleCancellationSubmit((values) =>
                      handleDecision(consultation.id, "cancelled", values.reason)
                    )}
                    noValidate
                  >
                    <label htmlFor={`reason-${consultation.id}`}>Reason for cancellation</label>
                    <textarea
                      id={`reason-${consultation.id}`}
                      placeholder="Help the patient understand why this request cannot be accepted."
                      maxLength={500}
                      aria-invalid={cancellationErrors.reason ? "true" : undefined}
                      aria-describedby={cancellationErrors.reason ? `reason-${consultation.id}-error` : undefined}
                      {...registerCancellation("reason")}
                    />
                    {cancellationErrors.reason?.message && (
                      <p className="consultation-detail__field-error" id={`reason-${consultation.id}-error`} role="alert">
                        {cancellationErrors.reason.message}
                      </p>
                    )}
                    <div className="consultation-detail__cancel-actions">
                      <button type="submit" disabled={cancellationSubmitting || actionId === consultation.id}>
                        {cancellationSubmitting || actionId === consultation.id ? "Submitting…" : "Submit cancellation"}
                      </button>
                      <button
                        type="button"
                        className="consultation-detail__secondary"
                        onClick={() => {
                          setSelectedCancelId(null);
                          resetCancellation({ reason: "" });
                        }}
                      >
                        Keep request
                      </button>
                    </div>
                  </form>
                )}

                {actionError && actionErrorId === consultation.id && (
                  <p className="consultation-detail__action-error" role="alert">{actionError}</p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {isPatient && (
        <aside className="patient-safety-note">
          <span className="patient-safety-note__icon" aria-hidden="true">!</span>
          <p><strong>Need immediate help?</strong> Scheduled consultations are not emergency services. If you are in immediate danger, contact local emergency services or a trusted person nearby.</p>
        </aside>
      )}
      {!isPatient && (
        <aside className="therapist-practice-note">
          <span className="therapist-practice-note__icon" aria-hidden="true">i</span>
          <p><strong>Keep requests current.</strong> Respond to new requests promptly and record a clear reason whenever a consultation cannot proceed.</p>
        </aside>
      )}
    </main>
  );

  return isPatient ? <PatientShell>{content}</PatientShell> : <TherapistShell>{content}</TherapistShell>;
}
