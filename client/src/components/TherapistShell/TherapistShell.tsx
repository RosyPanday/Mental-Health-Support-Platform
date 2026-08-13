import { NavLink } from "react-router-dom";

import type { ShellProps } from "../../interfaces/components";
import Navbar from "../Navbar/Navbar";

import "./TherapistShell.css";

const therapistLinks = [
  { label: "Overview", path: "/therapist-dashboard", end: true },
  { label: "Verification", path: "/therapist-documents" },
  { label: "New requests", path: "/therapist-pending" },
  { label: "Confirmed", path: "/therapist-confirmed" },
  { label: "History", path: "/therapist-cancelled" },
];

export default function TherapistShell({ children }: ShellProps) {
  return (
    <div className="therapist-shell">
      <Navbar type="therapist" />

      <div className="therapist-subnav-wrap">
        <nav className="therapist-subnav" aria-label="Therapist navigation">
          {therapistLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `therapist-subnav__link${isActive ? " therapist-subnav__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {children}
    </div>
  );
}
