import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PatientShell from "../../components/PatientShell/PatientShell";
import { useAuth } from "../../context/AuthContext";
import type { IconProps } from "../../interfaces/components";
import { viewConsultations } from "../../services/consultationService";
import type { ConsultationCounts } from "../../types/consultation";
import type { PatientDashboardIconName } from "../../types/icons";

import "./PatientDashboard.css";

const statusCards = [
  {
    key: "pending" as const,
    label: "Pending requests",
    description: "Waiting for a therapist response",
    path: "/pending-consultations",
    icon: "clock" as const,
  },
  {
    key: "confirmed" as const,
    label: "Upcoming sessions",
    description: "Confirmed consultations and payment",
    path: "/confirmed-consultations",
    icon: "calendar" as const,
  },
  {
    key: "cancelled" as const,
    label: "Past updates",
    description: "Review cancelled requests",
    path: "/cancelled-consultations",
    icon: "history" as const,
  },
];

function DashboardIcon({ name }: IconProps<PatientDashboardIconName>) {
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

  if (name === "heart") {
    return <svg {...props}><path d="M12 20.5S4 16 4 9.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 6.5-8 11-8 11Z" /><path d="M9 12h2l1-3 1.5 5 1-2H17" /></svg>;
  }

  if (name === "search") {
    return <svg {...props}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5M8 10.5h5m-2.5-2.5v5" /></svg>;
  }

  if (name === "clock") {
    return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  }

  if (name === "calendar") {
    return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4m8-4v4M3 10h18m-13 4h3m2 0h3" /></svg>;
  }

  if (name === "history") {
    return <svg {...props}><path d="M4 7v5h5" /><path d="M5.2 16A8 8 0 1 0 4 10" /><path d="M12 8v5l3 2" /></svg>;
  }

  if (name === "spark") {
    return <svg {...props}><path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3Z" /><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" /></svg>;
  }

  return <svg {...props}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
}

export default function PatientDashboard() {
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
        console.error("Unable to load consultation overview", error);
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

  return (
    <PatientShell>
      <main className="patient-dashboard">
        <section className="patient-dashboard__hero">
          <div className="patient-dashboard__hero-copy">
            <p className="patient-dashboard__date">{today}</p>
            <h1>Welcome back, {displayName}.</h1>
            <p>
              Take a breath, notice what you need, and choose one manageable step
              for today.
            </p>
            <div className="patient-dashboard__hero-actions">
              <Link to="/book-consultation" className="patient-dashboard__button patient-dashboard__button--primary">
                Find a therapist <DashboardIcon name="arrow" />
              </Link>
              <Link to="/depression-screening" className="patient-dashboard__button patient-dashboard__button--secondary">
                Start a wellbeing check
              </Link>
            </div>
          </div>

          <div className="patient-dashboard__pause-card">
            <span className="patient-dashboard__pause-icon"><DashboardIcon name="spark" /></span>
            <p>Today’s gentle reminder</p>
            <blockquote>“You are allowed to move at the pace that feels sustainable.”</blockquote>
            <span>One step is still progress.</span>
          </div>
        </section>

        <section className="patient-dashboard__section" aria-labelledby="care-overview-title">
          <div className="patient-dashboard__section-heading">
            <div>
              <p>Your care overview</p>
              <h2 id="care-overview-title">Consultations at a glance</h2>
            </div>
            <Link to="/pending-consultations">View requests <DashboardIcon name="arrow" /></Link>
          </div>

          <div className="patient-dashboard__status-grid">
            {statusCards.map((card) => (
              <Link to={card.path} className="patient-dashboard__status-card" key={card.key}>
                <span className={`patient-dashboard__status-icon patient-dashboard__status-icon--${card.key}`}>
                  <DashboardIcon name={card.icon} />
                </span>
                <span className="patient-dashboard__status-count">
                  {countsLoading || counts[card.key] === null ? "—" : counts[card.key]}
                </span>
                <h3>{card.label}</h3>
                <p>{card.description}</p>
                <span className="patient-dashboard__card-link">Open details <DashboardIcon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="patient-dashboard__section" aria-labelledby="next-step-title">
          <div className="patient-dashboard__section-heading">
            <div>
              <p>Choose your next step</p>
              <h2 id="next-step-title">Support for what you need today</h2>
            </div>
          </div>

          <div className="patient-dashboard__journey-grid">
            <article className="patient-dashboard__journey-card patient-dashboard__journey-card--checkin">
              <span className="patient-dashboard__journey-icon"><DashboardIcon name="heart" /></span>
              <p className="patient-dashboard__journey-label">Self reflection</p>
              <h3>Check in with how you have been feeling</h3>
              <p>Complete the nine-question PHQ-9 screening and receive an informational result.</p>
              <div className="patient-dashboard__journey-meta">
                <span>9 questions</span><span>About 3 minutes</span>
              </div>
              <Link to="/depression-screening">Begin check-in <DashboardIcon name="arrow" /></Link>
            </article>

            <article className="patient-dashboard__journey-card patient-dashboard__journey-card--support">
              <span className="patient-dashboard__journey-icon"><DashboardIcon name="search" /></span>
              <p className="patient-dashboard__journey-label">Professional support</p>
              <h3>Explore therapists matched to your needs</h3>
              <p>Describe the support you want and compare relevant therapists by experience and language.</p>
              <div className="patient-dashboard__journey-meta">
                <span>Guided search</span><span>Your preferred time</span>
              </div>
              <Link to="/book-consultation">Find support <DashboardIcon name="arrow" /></Link>
            </article>
          </div>
        </section>

        <section className="patient-dashboard__prepare">
          <div>
            <p className="patient-dashboard__prepare-kicker">Before a consultation</p>
            <h2>A little preparation can help you feel more at ease.</h2>
          </div>
          <ul>
            <li><span>01</span>Write down what you would most like support with.</li>
            <li><span>02</span>Choose a quiet, comfortable place for your session.</li>
            <li><span>03</span>Check the confirmed page for payment and joining details.</li>
          </ul>
        </section>

        <aside className="patient-safety-note">
          <span className="patient-safety-note__icon" aria-hidden="true">!</span>
          <p><strong>Need immediate help?</strong> This platform is not an emergency service. If you or someone else is in immediate danger, contact local emergency services or a trusted person nearby.</p>
        </aside>
      </main>
    </PatientShell>
  );
}
