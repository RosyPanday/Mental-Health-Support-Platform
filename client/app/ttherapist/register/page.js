"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    role: "patient",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    email: "",
    language: "",
    educationDegree: "",
    specialization: "",
    yearsOfExperience: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const input = {
      username: form.username,
      password: form.password,
      name: form.name,
      phoneNumber: form.phoneNumber,
      email: form.email,
      language: form.language,
      role: form.role,
    };

    if (form.role === "therapist") {
      input.educationDegree = form.educationDegree;
      input.specialization = form.specialization;
      input.yearsOfExperience = Number(form.yearsOfExperience);
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Signup($input: InputSignup) {
              signup(input: $input) {
                message
                data {
                  token
                  user {
                    username
                    role
                  }
                }
              }
            }
          `,
          variables: { input },
        }),
      });

      const result = await response.json();

      if (result.errors?.length) {
        setMessage(result.errors[0].message);
        return;
      }

      const token = result.data?.signup?.data?.token;

      if (!token) {
        setMessage("Account could not be created.");
        return;
      }

      localStorage.setItem("authToken", token);

      if (form.role === "patient") {
        router.push("/screening");
      } else {
        setMessage(
          "Therapist account created. Next, upload your verification documents."
        );
      }
    } catch (error) {
      setMessage("Server connection failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex justify-center items-center py-10 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Register as</p>

              <label className="mr-5">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={form.role === "patient"}
                  onChange={updateForm}
                  className="mr-2"
                />
                Patient
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="therapist"
                  checked={form.role === "therapist"}
                  onChange={updateForm}
                  className="mr-2"
                />
                Therapist
              </label>
            </div>

            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="language"
              placeholder="Language (e.g. Nepali)"
              value={form.language}
              onChange={updateForm}
              required
              className="w-full border rounded-lg p-3"
            />

            {form.role === "therapist" && (
              <>
                <input
                  name="educationDegree"
                  placeholder="Education Degree"
                  value={form.educationDegree}
                  onChange={updateForm}
                  required
                  className="w-full border rounded-lg p-3"
                />

                <input
                  name="specialization"
                  placeholder="Specialization"
                  value={form.specialization}
                  onChange={updateForm}
                  required
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="number"
                  name="yearsOfExperience"
                  placeholder="Years of Experience"
                  value={form.yearsOfExperience}
                  onChange={updateForm}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </>
            )}

            {message && (
              <p className="text-center text-red-500 text-sm">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : `Sign up as ${form.role}`}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}