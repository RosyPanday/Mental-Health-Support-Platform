"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, XCircle } from "lucide-react";

const fields = [
  { name: "profilePic", label: "Profile Picture", accept: "image/*" },
  { name: "educationalDoc1", label: "Educational Document 1", accept: "image/*,.pdf" },
  { name: "educationalDoc2", label: "Educational Document 2", accept: "image/*,.pdf" },
  { name: "professionalDoc", label: "Professional Document", accept: "image/*,.pdf" },
];

export default function TherapistDocumentsPage() {
  const router = useRouter();
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  const updateFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files?.[0] ?? null });
    setMessage("");
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus(null);

    const missing = fields.find((field) => !files[field.name]);
    if (missing) {
      setMessage(`Please select a file for ${missing.label}.`);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You need to be logged in. Please log in again.");
      return;
    }

    const formData = new FormData();
    for (const field of fields) formData.append(field.name, files[field.name]);

    setUploading(true);
    try {
      const response = await fetch("http://localhost:4000/api/upload/therapist-document", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json().catch(() => null);
      if (response.ok) {
        setStatus("success");
        setMessage("Documents uploaded successfully.");
      } else {
        setStatus("error");
        setMessage(result?.message || "Upload failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Server connection failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">Upload verification documents</h1>
      <p className="mt-3 leading-7 text-slate-600">
        Upload your profile picture, education documents, and professional document to start offering consultations to patients.
      </p>

      {status === "success" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Submitted successfully!</p>
            <p className="mt-1">Once the documents are reviewed, you will be verified and visible to patients. Welcome aboard.</p>
            <button type="button" onClick={() => router.push("/therapist/dashboard")} className="mt-3 font-semibold text-emerald-700 underline">
              Back to dashboard
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{field.label}</label>
            <input
              type="file"
              name={field.name}
              accept={field.accept}
              onChange={updateFile}
              required
              className="w-full rounded-lg border border-slate-200 p-3 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white"
            />
          </div>
        ))}

        {message && status !== "success" && (
          <p className={`flex items-start gap-2 text-sm ${status === "error" ? "text-rose-600" : "text-slate-600"}`}>
            {status === "error" && <XCircle size={16} className="mt-0.5 shrink-0" />}
            {message}
          </p>
        )}

        <button type="submit" disabled={uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300">
          <UploadCloud size={18} />
          {uploading ? "Uploading..." : "Upload documents"}
        </button>
      </form>
    </main>
  );
}