import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import TherapistShell from "../../components/TherapistShell/TherapistShell";
import type { IconProps } from "../../interfaces/components";
import type { FileBoxProps } from "../../interfaces/documents";
import { uploadTherapistDocuments } from "../../services/documentService";
import type { TherapistDocumentsFormValues } from "../../types/forms";
import type { TherapistDocumentsIconName } from "../../types/icons";
import { therapistDocumentsSchema } from "../../validation/formSchemas";

import "./TherapistDocuments.css";

function Icon({ name }: IconProps<TherapistDocumentsIconName>) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") return <svg {...props}><path d="M19 12H5m6-6-6 6 6 6" /></svg>;
  if (name === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (name === "shield") return <svg {...props}><path d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (name === "upload") return <svg {...props}><path d="M12 16V4m-4 4 4-4 4 4M5 14v6h14v-6" /></svg>;
  return <svg {...props}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6m-6 4h4" /></svg>;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileBox({
  accept,
  acceptedFormats,
  description,
  error,
  file,
  id,
  index,
  registration,
  title,
}: FileBoxProps) {
  const errorId = `${id}-error`;

  return (
    <section className={`therapist-documents__file${file ? " therapist-documents__file--selected" : ""}${error ? " therapist-documents__file--invalid" : ""}`}>
      <div className="therapist-documents__file-top">
        <span className="therapist-documents__file-number">{file && !error ? <Icon name="check" /> : index}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <label htmlFor={id} className="therapist-documents__picker">
        <span><Icon name={file ? "file" : "upload"} /></span>
        <span className="therapist-documents__picker-copy">
          <strong>{file ? file.name : "Choose a file"}</strong>
          <small>{file ? `${formatFileSize(file.size)} · Choose another file` : `${acceptedFormats} · Up to 8 MB`}</small>
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          {...registration}
        />
      </label>
      {error && <p className="therapist-documents__field-error" id={errorId} role="alert">{error}</p>}
    </section>
  );
}

export default function TherapistDocuments() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<TherapistDocumentsFormValues>({
    resolver: yupResolver(therapistDocumentsSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const profilePic = watch("profilePic")?.[0] ?? null;
  const educationalDoc1 = watch("educationalDoc1")?.[0] ?? null;
  const educationalDoc2 = watch("educationalDoc2")?.[0] ?? null;
  const professionalDoc = watch("professionalDoc")?.[0] ?? null;
  const files = [profilePic, educationalDoc1, educationalDoc2, professionalDoc];
  const selectedCount = files.filter(Boolean).length;
  const allFilesSelected = selectedCount === files.length;

  const clearMessages = () => {
    setServerError("");
    setSuccess("");
  };

  const handleUpload = async (values: TherapistDocumentsFormValues) => {
    const formData = new FormData();
    formData.append("profilePic", values.profilePic[0]);
    formData.append("educationalDoc1", values.educationalDoc1[0]);
    formData.append("educationalDoc2", values.educationalDoc2[0]);
    formData.append("professionalDoc", values.professionalDoc[0]);

    try {
      setServerError("");
      setSuccess("");
      await uploadTherapistDocuments(formData);
      setSuccess("Your documents were uploaded successfully and are ready for admin review.");
    } catch (uploadError) {
      console.error(uploadError);
      setServerError("We could not upload your documents. Check the files and try again.");
    }
  };

  return (
    <TherapistShell>
      <main className="therapist-page-shell therapist-documents">
        <header className="therapist-page-header">
          <div className="therapist-page-header__copy">
            <p className="therapist-page-eyebrow">Professional verification</p>
            <h1>Credential centre</h1>
            <p>
              Add all required records in one submission. The platform’s admin
              team reviews the documents after a successful upload.
            </p>
          </div>
          <Link to="/therapist-dashboard" className="therapist-back-link">
            <Icon name="arrow" /> Back to overview
          </Link>
        </header>

        <form onSubmit={handleSubmit(handleUpload)} noValidate>
          <section className="therapist-documents__overview">
            <div className="therapist-documents__progress-copy">
              <span className="therapist-documents__overview-icon"><Icon name="shield" /></span>
              <div>
                <p>Submission readiness</p>
                <strong>{selectedCount} of {files.length} files selected</strong>
              </div>
            </div>
            <div className="therapist-documents__progress" aria-label={`${selectedCount} of ${files.length} files selected`}>
              <span style={{ width: `${(selectedCount / files.length) * 100}%` }} />
            </div>
          </section>

          <div className="therapist-documents__grid">
            <FileBox
              id="profile-picture"
              index="01"
              title="Professional profile photo"
              description="A clear, recent photo used to represent your profile."
              file={profilePic}
              error={errors.profilePic?.message}
              registration={register("profilePic", { onChange: clearMessages })}
              accept="image/jpeg,image/png,image/webp"
              acceptedFormats="JPG, PNG or WebP"
            />
            <FileBox
              id="education-document-one"
              index="02"
              title="Primary education record"
              description="Your main counselling or mental-health qualification."
              file={educationalDoc1}
              error={errors.educationalDoc1?.message}
              registration={register("educationalDoc1", { onChange: clearMessages })}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              acceptedFormats="JPG, PNG, WebP or PDF"
            />
            <FileBox
              id="education-document-two"
              index="03"
              title="Additional education record"
              description="A supporting degree, course, or training certificate."
              file={educationalDoc2}
              error={errors.educationalDoc2?.message}
              registration={register("educationalDoc2", { onChange: clearMessages })}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              acceptedFormats="JPG, PNG, WebP or PDF"
            />
            <FileBox
              id="professional-document"
              index="04"
              title="Professional document"
              description="Your licence, registration, or professional credential."
              file={professionalDoc}
              error={errors.professionalDoc?.message}
              registration={register("professionalDoc", { onChange: clearMessages })}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              acceptedFormats="JPG, PNG, WebP or PDF"
            />
          </div>

          <section className="therapist-documents__submit-panel">
            <div>
              <p>Submit as one package</p>
              <h2>{allFilesSelected ? "Your files are ready to validate and upload." : "Complete each required document above."}</h2>
              <span>Make sure names and qualification details are readable before submitting.</span>
            </div>
            <button type="submit" disabled={isSubmitting}>
              <Icon name="upload" /> {isSubmitting ? "Uploading…" : "Submit documents"}
            </button>
          </section>

          <div className="therapist-documents__messages" aria-live="polite">
            {serverError && <p className="therapist-documents__message therapist-documents__message--error">{serverError}</p>}
            {success && <p className="therapist-documents__message therapist-documents__message--success"><Icon name="check" /> {success}</p>}
          </div>
        </form>

        <aside className="therapist-practice-note">
          <span className="therapist-practice-note__icon" aria-hidden="true"><Icon name="shield" /></span>
          <p><strong>Before you submit.</strong> Use clear, complete records that belong to you. Uploading documents starts review; it does not by itself indicate that verification is complete.</p>
        </aside>
      </main>
    </TherapistShell>
  );
}
