import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

import PatientDashboard from "../pages/PatientDashboard/PatientDashboard";

import TherapistDashboard from "../pages/TherapistDashboard/TherapistDashboard";

import DepressionScreening from "../pages/DepressionScreening/DepressionScreening";

import BookConsultation from "../pages/BookConsultation/BookConsultation";

import TherapistDocuments from "../pages/TherapistDocuments/TherapistDocuments";
import PatientPending from "../pages/Consultation/PatientPending";
import PatientConfirmed from "../pages/Consultation/PatientConfirmed";
import PatientCancelled from "../pages/Consultation/PatientCancelled";
import TherapistPending from "../pages/Consultation/TherapistPending";
import TherapistConfirmed from "../pages/Consultation/TherapistConfirmed";
import TherapistCancelled from "../pages/Consultation/TherapistCancelled";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import KhaltiVerification from "../pages/KhaltiVerification/KhaltiVerification";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/khalti-verification"
        element={
          <ProtectedRoute allowedRole="patient">
            <KhaltiVerification />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/therapist-dashboard"
        element={
          <ProtectedRoute allowedRole="therapist">
            <TherapistDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/depression-screening"
        element={
          <ProtectedRoute allowedRole="patient">
            <DepressionScreening />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-consultation"
        element={
          <ProtectedRoute allowedRole="patient">
            <BookConsultation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/therapist-documents"
        element={
          <ProtectedRoute allowedRole="therapist">
            <TherapistDocuments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pending-consultations"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientPending />
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirmed-consultations"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientConfirmed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cancelled-consultations"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientCancelled />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist-pending"
        element={
          <ProtectedRoute allowedRole="therapist">
            <TherapistPending />
          </ProtectedRoute>
        }
      />

      <Route
        path="/therapist-confirmed"
        element={
          <ProtectedRoute allowedRole="therapist">
            <TherapistConfirmed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/therapist-cancelled"
        element={
          <ProtectedRoute allowedRole="therapist">
            <TherapistCancelled />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
