import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import hero from "../../assets/hero.png";
import type { IconProps } from "../../interfaces/components";
import type { SupportOption } from "../../interfaces/landing";
import type { LandingIconName } from "../../types/icons";

import "./Landing.css";

const supportOptions: SupportOption[] = [
  {
    icon: "checkIn",
    title: "Check in with yourself",
    description:
      "Complete a guided PHQ-9 screening to reflect on how you have been feeling over the last two weeks.",
    note: "A private moment of reflection",
  },
  {
    icon: "match",
    title: "Find the right support",
    description:
      "Describe what is on your mind and explore therapists whose experience fits the support you are looking for.",
    note: "Matched to your needs",
  },
  {
    icon: "calendar",
    title: "Request a consultation",
    description:
      "Choose a therapist, share your preferred time, and keep track of the request from your personal dashboard.",
    note: "Simple and manageable",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your space",
    description:
      "Sign up as a client or therapist and enter a dashboard designed around your role.",
  },
  {
    number: "02",
    title: "Choose your next step",
    description:
      "Start with a self-check-in, search for a therapist, or manage your consultation requests.",
  },
  {
    number: "03",
    title: "Move forward with support",
    description:
      "Request a time that works for you and follow the status of your consultation in one place.",
  },
];

const faqs = [
  {
    question: "Is the PHQ-9 screening a diagnosis?",
    answer:
      "No. It is an informational self-screening tool and does not replace a diagnosis, medical advice, or care from a qualified professional.",
  },
  {
    question: "How does therapist matching work?",
    answer:
      "You describe the kind of support you need, and the platform returns relevant therapists so you can compare their specialization, experience, and language.",
  },
  {
    question: "Can therapists join the platform?",
    answer:
      "Yes. Therapists can create a professional account, submit education and professional documents for review, and manage consultation requests after onboarding.",
  },
  {
    question: "What happens after I request a consultation?",
    answer:
      "Your request appears in your dashboard, where you can follow it as pending, confirmed, or cancelled.",
  },
];

function LandingIcon({ name }: IconProps<LandingIconName>) {
  const commonProps = {
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

  if (name === "checkIn") {
    return (
      <svg {...commonProps}>
        <path d="M8.5 3.8A4.5 4.5 0 0 0 4 8.3c0 5.3 8 11.9 8 11.9s8-6.6 8-11.9a4.5 4.5 0 0 0-8-3.7 4.5 4.5 0 0 0-3.5-.8Z" />
        <path d="m8.2 11.2 2.2 2.1 5.3-5" />
      </svg>
    );
  }

  if (name === "match") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3.5 19c.5-3.2 2.3-5 5.5-5s5 1.8 5.5 5" />
        <path d="M16.5 8.5h4M18.5 6.5v4" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18m-13 4h3m2 0h3m-8 3h3" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...commonProps}>
        <path d="M12 3 5 6v5c0 4.7 2.8 8.4 7 10 4.2-1.6 7-5.3 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (name === "patient") {
    return (
      <svg {...commonProps}>
        <path d="M12 21s-7-4.4-7-11a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 6.6-7 11-7 11Z" />
        <path d="M9 13h2l1-3 1.5 5 1-2H17" />
      </svg>
    );
  }

  if (name === "therapist") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c.7-4.5 3.2-7 7.5-7s6.8 2.5 7.5 7" />
        <path d="m9.5 17 2.5 2 2.5-2" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...commonProps}>
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 20.5S4 16 4 9.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 6.5-8 11-8 11Z" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />

      <main>
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-hero__glow landing-hero__glow--one" />
          <div className="landing-hero__glow landing-hero__glow--two" />

          <div className="landing-shell landing-hero__inner">
            <div className="landing-hero__content">
              <p className="landing-eyebrow">
                <span aria-hidden="true">●</span>
                Support that starts with listening
              </p>

              <h1 id="landing-title">
                Mental health support that meets you
                <span> where you are.</span>
              </h1>

              <p className="landing-hero__subtitle">
                Reflect on how you are feeling, find a therapist who fits your
                needs, and request a consultation—all in one thoughtful space.
              </p>

              <div className="landing-hero__actions">
                <Link to="/signup" className="landing-button landing-button--primary">
                  Get started
                  <LandingIcon name="arrow" />
                </Link>
                <Link to="/login" className="landing-button landing-button--secondary">
                  I already have an account
                </Link>
              </div>

              <ul className="landing-trust-list" aria-label="Platform highlights">
                <li>
                  <span>✓</span> Guided self-check-in
                </li>
                <li>
                  <span>✓</span> Therapist matching
                </li>
                <li>
                  <span>✓</span> Simple consultation requests
                </li>
              </ul>
            </div>

            <figure className="landing-hero__visual">
              <div className="landing-hero__image-wrap">
                <img
                  src={hero}
                  alt="A quiet lakeside landscape surrounded by green trees"
                />
                <div className="landing-hero__image-shade" />
                <figcaption>
                  <span className="landing-quote-mark" aria-hidden="true">
                    “
                  </span>
                  <p>There is no wrong place to begin.</p>
                  <span>Take one small step today.</span>
                </figcaption>
              </div>

              <div className="landing-floating-card">
                <span className="landing-floating-card__icon">
                  <LandingIcon name="heart" />
                </span>
                <span>
                  <strong>Your pace matters</strong>
                  <small>Pause, reflect, then choose</small>
                </span>
              </div>
            </figure>
          </div>
        </section>

        <aside className="landing-safety" aria-label="Urgent support information">
          <div className="landing-shell landing-safety__inner">
            <span className="landing-safety__icon">
              <LandingIcon name="shield" />
            </span>
            <p>
              <strong>Need urgent help?</strong> This platform is not an emergency
              service. If you or someone else is in immediate danger, contact local
              emergency services or a trusted person nearby.
            </p>
          </div>
        </aside>

        <section className="landing-section" id="support" aria-labelledby="support-title">
          <div className="landing-shell">
            <div className="landing-section-heading landing-section-heading--centered">
              <p className="landing-kicker">Ways we support you</p>
              <h2 id="support-title">Start with the step that feels right</h2>
              <p>
                Mental health care is not one-size-fits-all. Use the tools you need
                today and return to the others when you are ready.
              </p>
            </div>

            <div className="landing-support-grid">
              {supportOptions.map((option) => (
                <article className="landing-support-card" key={option.title}>
                  <span className="landing-icon-badge">
                    <LandingIcon name={option.icon} />
                  </span>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <span className="landing-card-note">{option.note}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-section--tinted" id="how-it-works" aria-labelledby="steps-title">
          <div className="landing-shell landing-steps-layout">
            <div className="landing-section-heading">
              <p className="landing-kicker">How it works</p>
              <h2 id="steps-title">A clear path, without the pressure</h2>
              <p>
                You stay in control of what comes next. The platform keeps each
                step straightforward and easy to revisit.
              </p>
              <Link to="/signup" className="landing-text-link">
                Create your account
                <LandingIcon name="arrow" />
              </Link>
            </div>

            <ol className="landing-steps">
              {steps.map((step) => (
                <li key={step.number}>
                  <span className="landing-step-number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section" id="community" aria-labelledby="community-title">
          <div className="landing-shell">
            <div className="landing-section-heading landing-section-heading--centered">
              <p className="landing-kicker">One caring community</p>
              <h2 id="community-title">Built for clients and therapists</h2>
              <p>
                Whether you are looking for support or offering it, your workspace
                is focused on what matters to you.
              </p>
            </div>

            <div className="landing-audience-grid">
              <article className="landing-audience-card landing-audience-card--client">
                <span className="landing-icon-badge">
                  <LandingIcon name="patient" />
                </span>
                <p className="landing-audience-card__label">For clients</p>
                <h3>Support for your next step</h3>
                <p>
                  Reflect with a guided screening, discover relevant therapists,
                  and manage every consultation request from one dashboard.
                </p>
                <Link to="/signup" state={{ role: "patient" }} className="landing-text-link">
                  Join as a client
                  <LandingIcon name="arrow" />
                </Link>
              </article>

              <article className="landing-audience-card landing-audience-card--therapist">
                <span className="landing-icon-badge landing-icon-badge--light">
                  <LandingIcon name="therapist" />
                </span>
                <p className="landing-audience-card__label">For therapists</p>
                <h3>Make your care easier to access</h3>
                <p>
                  Create a professional profile, submit your credentials for review,
                  and respond to new consultation requests in one place.
                </p>
                <Link to="/signup" state={{ role: "therapist" }} className="landing-text-link landing-text-link--light">
                  Join as a therapist
                  <LandingIcon name="arrow" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section landing-faq" id="faq" aria-labelledby="faq-title">
          <div className="landing-shell landing-faq__layout">
            <div className="landing-section-heading">
              <p className="landing-kicker">Good to know</p>
              <h2 id="faq-title">Questions before you begin</h2>
              <p>
                A little clarity can make the first step easier. Here is what to
                expect from the platform.
              </p>
            </div>

            <div className="landing-faq__list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta" aria-labelledby="cta-title">
          <div className="landing-cta__decoration landing-cta__decoration--left" />
          <div className="landing-cta__decoration landing-cta__decoration--right" />
          <div className="landing-shell landing-cta__inner">
            <span className="landing-cta__icon">
              <LandingIcon name="heart" />
            </span>
            <p className="landing-kicker">Begin gently</p>
            <h2 id="cta-title">You do not have to figure it all out today.</h2>
            <p>
              Create your account and take one small, meaningful step toward the
              support you deserve.
            </p>
            <div className="landing-cta__actions">
              <Link to="/signup" className="landing-button landing-button--cream">
                Create a free account
                <LandingIcon name="arrow" />
              </Link>
              <Link to="/login" className="landing-button landing-button--ghost">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-shell landing-footer__top">
          <div className="landing-footer__brand">
            <Link to="/" className="landing-footer__logo">
              <span aria-hidden="true">🌿</span>
              Mental Health Support
            </Link>
            <p>A thoughtful place to reflect, connect, and move forward.</p>
          </div>

          <nav className="landing-footer__links" aria-label="Footer navigation">
            <a href="#support">Support options</a>
            <a href="#how-it-works">How it works</a>
            <a href="#community">For therapists</a>
            <a href="#faq">FAQs</a>
          </nav>
        </div>
        <div className="landing-shell landing-footer__bottom">
          <p>© {new Date().getFullYear()} Mental Health Support Platform</p>
          <p>Informational support only. Not a replacement for professional care.</p>
        </div>
      </footer>
    </div>
  );
}
