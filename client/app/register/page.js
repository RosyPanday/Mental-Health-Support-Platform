"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { saveAuthSession } from "@/lib/auth";

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
          variables: {
            input,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setMessage(result.errors[0].message);
        return;
      }

      const token = result.data?.signup?.data?.token;

      if (!token) {
        setMessage("Account creation failed.");
        return;
      }

const role = result.data?.signup?.data?.user?.role ?? form.role;
      saveAuthSession(token, role);

      if (form.role === "patient") {
        router.push("/home");
        return;
      }

      router.push("/therapist/dashboard");

    } catch {
      setMessage(
        "Server connection failed. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex justify-center items-center py-10 px-4">

        <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-center text-emerald-600 mb-6">
            Create Account
          </h1>


          <form onSubmit={handleSubmit} className="space-y-4">


            <div>
              <p className="font-semibold mb-2">
                Register as
              </p>

              <label className="mr-6">
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
              className="w-full border p-3 rounded-lg"
            />


            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={updateForm}
              required
              className="w-full border p-3 rounded-lg"
            />


            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={updateForm}
              required
              className="w-full border p-3 rounded-lg"
            />


            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={updateForm}
              required
              className="w-full border p-3 rounded-lg"
            />


            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={updateForm}
              required
              className="w-full border p-3 rounded-lg"
            />


            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={updateForm}
              required
              className="w-full border p-3 rounded-lg"
            />


            <input
              name="language"
              placeholder="Language (Nepali/English)"
              value={form.language}
              onChange={updateForm}
              required
              className="w-full border p-3 rounded-lg"
            />



            {form.role === "therapist" && (
              <>
                <input
                  name="educationDegree"
                  placeholder="Education Degree"
                  value={form.educationDegree}
                  onChange={updateForm}
                  required
                  className="w-full border p-3 rounded-lg"
                />


                <input
                  name="specialization"
                  placeholder="Specialization"
                  value={form.specialization}
                  onChange={updateForm}
                  required
                  className="w-full border p-3 rounded-lg"
                />


                <input
                  type="number"
                  name="yearsOfExperience"
                  placeholder="Years of Experience"
                  value={form.yearsOfExperience}
                  onChange={updateForm}
                  required
                  className="w-full border p-3 rounded-lg"
                />
              </>
            )}



            {message && (
              <p className="text-center text-sm text-red-500">
                {message}
              </p>
            )}



            <button
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {loading
                ? "Creating Account..."
                : `Sign up as ${form.role}`}
            </button>


          </form>


          <p className="text-center mt-5 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 font-semibold"
            >
              Login
            </Link>
          </p>


        </div>

      </div>
    </>
  );
}
