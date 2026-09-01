import { NavLink } from "react-router-dom";

import type { ShellProps } from "../../interfaces/components";
import Navbar from "../Navbar/Navbar";

import "./PatientShell.css";

const patientLinks = [
  { label: "Overview", path: "/patient-dashboard", end: true },
  { label: "Wellbeing check", path: "/depression-screening" },
  { label: "Find a therapist", path: "/book-consultation" },
  { label: "Requests", path: "/pending-consultations" },
  { label: "Upcoming", path: "/confirmed-consultations" },
  { label: "History", path: "/cancelled-consultations" },
];

export default function PatientShell({ children }: ShellProps) {
  return (
    <div className="patient-shell">
      <Navbar type="patient" />

      <div className="patient-subnav-wrap">
        <nav className="patient-subnav" aria-label="Patient navigation">
          {patientLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `patient-subnav__link${isActive ? " patient-subnav__link--active" : ""}`
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
