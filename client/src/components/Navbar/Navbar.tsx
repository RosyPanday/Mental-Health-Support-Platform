import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import type { NavItem, NavbarProps } from "../../interfaces/components";

export default function Navbar({ type = "landing" }: NavbarProps) {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  const patientLinks: NavItem[] = [];
  const adminLinks: NavItem[] = [
    {
      name: "Verify Therapists",
      path: "/admin-dashboard",
    },
  ];

  const therapistLinks: NavItem[] = [];
  let links: NavItem[] = [];

  if (type === "patient") {
    links = patientLinks;
  }

  if (type === "therapist") {
    links = therapistLinks;
  }

  if (type === "admin") {
    links = adminLinks;
  }

  const homePath = {
    landing: "/",
    patient: "/patient-dashboard",
    therapist: "/therapist-dashboard",
    admin: "/admin-dashboard",
  }[type];

  return (
    <nav className={`navbar ${type === "landing" ? "navbar--landing" : ""}`} aria-label="Primary navigation">
      <Link to={homePath} className="logo" aria-label="Mental Health Support home">
        <span className="logo-mark" aria-hidden="true">🌿</span>
        <span>Mental Health Wellbeing</span>
      </Link>

      {type === "landing" && (
        <div className="landing-nav-links">
          <a href="#support">Support</a>
          <a href="#how-it-works">How it works</a>
          <a href="#community">Community</a>
          <a href="#faq">FAQs</a>
        </div>
      )}

      <div className="nav-right">
        {links.map((item) => (
          <Link key={item.name} to={item.path} className="nav-btn">
            {item.name}
          </Link>
        ))}

        {type === "landing" && (
          <>
            <Link to="/login" className="nav-btn">
              Login
            </Link>

            <Link to="/signup" className="nav-btn signup">
              Sign Up
            </Link>
          </>
        )}

        {(type === "patient" || type === "therapist" || type === "admin") && (
          <>
            {(type === "patient" || type === "therapist") && (
              <div className="nav-user" aria-label={`Signed in as ${user?.username}`}>
                <span className="nav-user__avatar" aria-hidden="true">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="nav-user__name">{user?.username}</span>
              </div>
            )}
            <button className="nav-btn signup" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
