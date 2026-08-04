'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { SIGNUP_MUTATION } from '../../graphql/mutations';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'PATIENT' | 'THERAPIST'>('PATIENT');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signup({
        variables: {
          input: {
            ...formData,
            role: role,
          },
        },
      });

      // Line 34
const signupData = (res.data as any)?.signup;

if (signupData?.token) {
  // १. टोकन LocalStorage मा सेभ गर्ने
  localStorage.setItem('token', signupData.token);
  alert('Signup Successful!');

  // २. Role अनुसार Redirect गर्ने
  if (role === 'THERAPIST') {
    router.push('/therapist-dashboard');
  } else {
    router.push('/patient-dashboard');
  }
}
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-2xl font-bold text-center mb-6">
        Sign Up as {role === 'PATIENT' ? 'Patient' : 'Therapist'}
      </h2>

      {/* Role छान्ने Switcher */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`w-1/2 py-2 rounded font-semibold ${
            role === 'PATIENT' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setRole('PATIENT')}
        >
          Patient
        </button>
        <button
          type="button"
          className={`w-1/2 py-2 rounded font-semibold ${
            role === 'THERAPIST' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setRole('THERAPIST')}
        >
          Therapist
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded w-full"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="border p-2 rounded w-full"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 rounded w-full"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Sign Up'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error.message}</p>}
    </div>
  );
}