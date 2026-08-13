import { Link } from "react-router-dom";

import hero from "../../assets/hero.png";
import type { AuthLayoutProps } from "../../interfaces/auth";

import "./AuthLayout.css";

const panelContent = {
  login: {
    kicker: "Welcome back",
    title: "A steady place to continue your journey.",
    description:
      "Return to your personal space and pick up from the step that matters today.",
    points: [
      "Review your consultation requests",
      "Continue a guided self-check-in",
      "Connect with relevant therapists",
    ],
    quote: "Progress can be quiet and still be meaningful.",
  },
  signup: {
    kicker: "Begin gently",
    title: "One small step can open the door to support.",
    description:
      "Create a space shaped around your role, whether you are seeking care or offering it.",
    points: [
      "A dashboard designed for your role",
      "Clear tools with no unnecessary pressure",
      "Simple consultation management",
    ],
    quote: "There is no wrong place to begin.",
  },
};

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5m6-6-6 6 6 6" />
    </svg>
  );
}

export default function AuthLayout({
  mode,
  eyebrow,
  title,
  subtitle,
  children,
  alternateState,
}: AuthLayoutProps) {
  const content = panelContent[mode];
  const isLogin = mode === "login";
  const alternatePath = isLogin ? "/signup" : "/login";
  const alternateLabel = isLogin ? "Create account" : "Sign in";

  return (
    <div className={`auth-shell auth-shell--${mode}`}>
      <header className="auth-topbar">
        <Link to="/" className="auth-brand" aria-label="Mental Health Support home">
          <span className="auth-brand__mark" aria-hidden="true">
            🌿
          </span>
          <span>Mental Health Wellbeing</span>
        </Link>

        <nav className="auth-topbar__nav" aria-label="Authentication navigation">
          <span>{isLogin ? "New to the platform?" : "Already have an account?"}</span>
          <Link to={alternatePath} state={alternateState}>
            {alternateLabel}
          </Link>
        </nav>
      </header>

      <main className="auth-main">
        <aside className="auth-story" aria-label="About Mental Health Support">
          <img src={hero} alt="" className="auth-story__image" />
          <div className="auth-story__overlay" />

          <Link to="/" className="auth-back-link">
            <ArrowIcon />
            Back to home
          </Link>

          <div className="auth-story__content">
            <p className="auth-story__kicker">{content.kicker}</p>
            <h2>{content.title}</h2>
            <p className="auth-story__description">{content.description}</p>

            <ul>
              {content.points.map((point) => (
                <li key={point}>
                  <span aria-hidden="true">✓</span>
                  {point}
                </li>
              ))}
            </ul>

            <blockquote>“{content.quote}”</blockquote>
          </div>
        </aside>

        <section className="auth-panel" aria-labelledby={`${mode}-title`}>
          <div className="auth-panel__inner">
            <Link to="/" className="auth-back-link auth-back-link--mobile">
              <ArrowIcon />
              Back to home
            </Link>

            <div className="auth-panel__heading">
              <p>{eyebrow}</p>
              <h1 id={`${mode}-title`}>{title}</h1>
              <span>{subtitle}</span>
            </div>

            {children}

            <p className="auth-panel__alternate">
              {isLogin ? "New to the platform?" : "Already have an account?"}{" "}
              <Link to={alternatePath} state={alternateState}>
                {alternateLabel}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
