"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveAuthSession } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Login($input: InputLogin) {
              login(input: $input) {
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
            input: {
              username: formData.username,
              password: formData.password,
              role,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setError(result.errors[0].message);
        return;
      }

      const token = result.data?.login?.data?.token;

      if (!token) {
        setError("Login failed. Please try again.");
        return;
      }

      const loggedInRole = result.data?.login?.data?.user?.role;
      saveAuthSession(token, loggedInRole);

      router.push(loggedInRole === "therapist" ? "/therapist/dashboard" : "/home");
    } catch {
      setError("Server connection failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
        {role === "therapist" ? "Therapist Login" : "Patient Login"}
      </h2>

      <div className="mb-6">
        <p className="block text-xs font-semibold text-slate-600 mb-1">
          Login as
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              checked={role === "patient"}
              onChange={() => setRole("patient")}
            />
            Patient
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              checked={role === "therapist"}
              onChange={() => setRole("therapist")}
            />
            Therapist
          </label>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Username
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full border border-slate-200 rounded-lg p-2.5"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full border border-slate-200 rounded-lg p-2.5"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg"
        >
          Sign In
        </button>
      </form>

      <p className="text-xs text-center text-slate-500 mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-emerald-600 font-semibold">
          Register
        </Link>
      </p>
    </div>
  );
}
