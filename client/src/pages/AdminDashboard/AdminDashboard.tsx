import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  fetchUnverifiedTherapists,
  verifyTherapist,
} from "../../services/adminService";
import type { UnverifiedTherapist } from "../../interfaces/admin";
import { BASE_URL } from "../../api/restClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [therapists, setTherapists] = useState<UnverifiedTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);
      const data = await fetchUnverifiedTherapists();
      setTherapists(data || []);
      setErrorMessage("");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Unable to load therapists.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (therapistId: number) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");
      const response = await verifyTherapist(therapistId);
      setSuccessMessage(response?.message || "Therapist verified successfully.");
      await loadTherapists();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Verification failed.");
    }
  };

  // Dedicated URL resolver with distinct default fallbacks for profile vs document
  const getMediaUrl = (path?: string | null, defaultFallback: string = "/default-profile.png") => {
    if (!path) return defaultFallback;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="admin-page">
      <Navbar type="admin" />

      <main className="admin-container">
        <header className="dashboard-header">
          <div>
            <h1>Therapist Verification Portal</h1>
            <p className="subtitle">
              Review credential submissions to ensure safe, quality care for patients.
            </p>
          </div>
          <div className="pending-badge">
            {therapists.length} Pending Approval
          </div>
        </header>

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠</span>
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading application requests...</p>
          </div>
        ) : therapists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <h3>All caught up!</h3>
            <p>There are currently no therapist accounts awaiting verification.</p>
          </div>
        ) : (
          <div className="therapists-grid">
            {therapists.map((therapist) => (
              <article key={therapist.id} className="therapist-card">
                <div className="therapist-header">
                  {/* Round profile image */}
                  <img
                    src={getMediaUrl(therapist.profilePic, "/default-profile.png")}
                    alt={therapist.name}
                    className="therapist-image"
                  />

                  <div className="therapist-info">
                    <h2>{therapist.name}</h2>
                    <span className="specialization-tag">
                      {therapist.specialization}
                    </span>

                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Language</span>
                        <span className="detail-value">{therapist.language || "Not provided"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email Address</span>
                        <span className="detail-value">{therapist.email || "Not provided"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone Number</span>
                        <span className="detail-value">{therapist.phoneNumber || "Not provided"}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="verify-btn verify-btn-inline"
                      onClick={() => handleVerify(therapist.id)}
                    >
                      ✓ Verify Therapist
                    </button>
                  </div>
                </div>

                {/* Submitted Credentials Section */}
                <div className="documents-section">
                  <h3>Submitted Credentials</h3>

                  <div className="documents-grid">
                    {therapist.educationalDoc1 && (
                      <div className="document-card">
                        <span className="doc-title">Educational Certificate 1</span>
                        <div 
                          className="image-wrapper"
                          onClick={() => setSelectedImage(getMediaUrl(therapist.educationalDoc1, ""))}
                        >
                          <img
                            src={getMediaUrl(therapist.educationalDoc1, "")}
                            alt="Educational Document 1"
                            className="document-image"
                          />
                          <span className="preview-overlay">Click to view</span>
                        </div>
                      </div>
                    )}

                    {therapist.educationalDoc2 && (
                      <div className="document-card">
                        <span className="doc-title">Educational Certificate 2</span>
                        <div 
                          className="image-wrapper"
                          onClick={() => setSelectedImage(getMediaUrl(therapist.educationalDoc2, ""))}
                        >
                          <img
                            src={getMediaUrl(therapist.educationalDoc2, "")}
                            alt="Educational Document 2"
                            className="document-image"
                          />
                          <span className="preview-overlay">Click to view</span>
                        </div>
                      </div>
                    )}

                    {therapist.professionalDoc && (
                      <div className="document-card">
                        <span className="doc-title">Professional License / Doc</span>
                        <div 
                          className="image-wrapper"
                          onClick={() => setSelectedImage(getMediaUrl(therapist.professionalDoc, ""))}
                        >
                          <img
                            src={getMediaUrl(therapist.professionalDoc, "")}
                            alt="Professional Document"
                            className="document-image"
                          />
                          <span className="preview-overlay">Click to view</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal preview for full size images */}
        {selectedImage && (
          <div className="modal-backdrop" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="modal-close" onClick={() => setSelectedImage(null)}>✕</button>
              <img src={selectedImage} alt="Document Preview" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
