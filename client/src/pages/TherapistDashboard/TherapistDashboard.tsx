import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TherapistShell from "../../components/TherapistShell/TherapistShell";
import { useAuth } from "../../context/AuthContext";
import type { IconProps } from "../../interfaces/components";
import { viewConsultations } from "../../services/consultationService";
import type { ConsultationCounts } from "../../types/consultation";
import type { TherapistDashboardIconName } from "../../types/icons";

import "./TherapistDashboard.css";

const statusCards = [
  {
    key: "pending" as const,
    label: "New requests",
    description: "Consultation requests awaiting your response",
    path: "/therapist-pending",
    icon: "clock" as const,
  },
  {
    key: "confirmed" as const,
    label: "Confirmed sessions",
    description: "Upcoming sessions and client contact details",
    path: "/therapist-confirmed",
    icon: "calendar" as const,
  },
  {
    key: "cancelled" as const,
    label: "Request history",
    description: "Cancelled requests and recorded reasons",
    path: "/therapist-cancelled",
    icon: "history" as const,
  },
];

function DashboardIcon({ name }: IconProps<TherapistDashboardIconName>) {
  const props = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "calendar") return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4m8-4v4M3 10h18m-13 4h3m2 0h3" /></svg>;
  if (name === "clock") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  if (name === "history") return <svg {...props}><path d="M4 7v5h5" /><path d="M5.2 16A8 8 0 1 0 4 10" /><path d="M12 8v5l3 2" /></svg>;
  if (name === "document") return <svg {...props}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6m-6 4h4" /></svg>;
  if (name === "shield") return <svg {...props}><path d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (name === "video") return <svg {...props}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>;
  if (name === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  return <svg {...props}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
}

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<ConsultationCounts>({
    pending: null,
    confirmed: null,
    cancelled: null,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCounts = async () => {
      try {
        const [pending, confirmed, cancelled] = await Promise.all([
          viewConsultations("pending"),
          viewConsultations("confirmed"),
          viewConsultations("cancelled"),
        ]);

        if (active) {
          setCounts({
            pending: pending.length,
            confirmed: confirmed.length,
            cancelled: cancelled.length,
          });
        }
      } catch (error) {
        console.error("Unable to load therapist consultation overview", error);
      } finally {
        if (active) setCountsLoading(false);
      }
    };

    loadCounts();
    return () => {
      active = false;
    };
  }, []);

  const displayName = user?.name || user?.username || "there";
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const pendingCount = counts.pending;

  return (
    <TherapistShell>
      <main className="therapist-dashboard">
        <section className="therapist-dashboard__hero">
          <div className="therapist-dashboard__hero-copy">
            <p className="therapist-dashboard__date">Practice overview · {today}</p>
            <h1>Welcome back, {displayName}.</h1>
            <p>
              Review consultation requests, prepare for confirmed sessions, and
              keep your professional documents ready for verification.
            </p>
            <div className="therapist-dashboard__hero-actions">
              <Link to="/therapist-pending" className="therapist-dashboard__button therapist-dashboard__button--primary">
                Review new requests <DashboardIcon name="arrow" />
              </Link>
              <Link to="/therapist-documents" className="therapist-dashboard__button therapist-dashboard__button--secondary">
                Manage verification
              </Link>
            </div>
          </div>

          <aside className="therapist-dashboard__priority-card">
            <span className="therapist-dashboard__priority-icon"><DashboardIcon name="clock" /></span>
            <p>Next priority</p>
            <strong>
              {countsLoading || pendingCount === null
                ? "Check your request queue"
                : pendingCount === 0
                  ? "Your request queue is clear"
                  : `${pendingCount} ${pendingCount === 1 ? "request needs" : "requests need"} a response`}
            </strong>
            <span>Timely responses help clients plan their care with confidence.</span>
            <Link to="/therapist-pending">Open requests <DashboardIcon name="arrow" /></Link>
          </aside>
        </section>

        <section className="therapist-dashboard__section" aria-labelledby="practice-overview-title">
          <div className="therapist-dashboard__section-heading">
            <div>
              <p>Your caseload</p>
              <h2 id="practice-overview-title">Consultations at a glance</h2>
            </div>
            <Link to="/therapist-pending">Manage requests <DashboardIcon name="arrow" /></Link>
          </div>

          <div className="therapist-dashboard__status-grid">
            {statusCards.map((card) => (
              <Link to={card.path} className="therapist-dashboard__status-card" key={card.key}>
                <span className={`therapist-dashboard__status-icon therapist-dashboard__status-icon--${card.key}`}>
                  <DashboardIcon name={card.icon} />
                </span>
                <span className="therapist-dashboard__status-count">
                  {countsLoading || counts[card.key] === null ? "—" : counts[card.key]}
                </span>
                <h3>{card.label}</h3>
                <p>{card.description}</p>
                <span className="therapist-dashboard__card-link">Open details <DashboardIcon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="therapist-dashboard__section" aria-labelledby="practice-tools-title">
          <div className="therapist-dashboard__section-heading">
            <div>
              <p>Practice tools</p>
              <h2 id="practice-tools-title">Keep your account session-ready</h2>
            </div>
          </div>

          <div className="therapist-dashboard__tools-grid">
            <article className="therapist-dashboard__tool-card therapist-dashboard__tool-card--credentials">
              <span className="therapist-dashboard__tool-icon"><DashboardIcon name="document" /></span>
              <p className="therapist-dashboard__tool-label">Credential centre</p>
              <h3>Submit the documents required for admin verification</h3>
              <p>Upload a profile photo, education records, and your professional document in one guided flow.</p>
              <Link to="/therapist-documents">Review documents <DashboardIcon name="arrow" /></Link>
            </article>

            <article className="therapist-dashboard__tool-card therapist-dashboard__tool-card--sessions">
              <span className="therapist-dashboard__tool-icon"><DashboardIcon name="video" /></span>
              <p className="therapist-dashboard__tool-label">Session centre</p>
              <h3>Find your confirmed client and joining details</h3>
              <p>Use the confirmed queue to review timing, client contact details, and the video-session link.</p>
              <Link to="/therapist-confirmed">View confirmed sessions <DashboardIcon name="arrow" /></Link>
            </article>
          </div>
        </section>

        <section className="therapist-dashboard__checklist">
          <div>
            <p className="therapist-dashboard__checklist-kicker">Before your next session</p>
            <h2>A short readiness check keeps the experience focused.</h2>
          </div>
          <ul>
            <li><span><DashboardIcon name="check" /></span>Review the confirmed time and client contact information.</li>
            <li><span><DashboardIcon name="check" /></span>Choose a private setting and test your camera and audio.</li>
            <li><span><DashboardIcon name="check" /></span>Use the platform’s joining flow when the session is due.</li>
          </ul>
        </section>

        <aside className="therapist-practice-note">
          <span className="therapist-practice-note__icon" aria-hidden="true"><DashboardIcon name="shield" /></span>
          <p><strong>Professional reminder.</strong> Keep client information private and use your established emergency and safeguarding procedures whenever urgent risk is identified.</p>
        </aside>
      </main>
    </TherapistShell>
  );
}
