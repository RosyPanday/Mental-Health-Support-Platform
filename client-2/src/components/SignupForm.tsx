import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { setAuthCookies } from '../utils/auth';

const initialState = {
  name: '',
  username: '',
  password: '',
  email: '',
  educationDegree: '',
  specialization: '',
  yearsOfExperience: '',
  phoneNumber: '',
  language: '',
};

const SignupForm = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const apiRole = role === 'therapist' ? 'therapist' : 'patient';
  const displayRole = role === 'therapist' ? 'therapist' : 'client';
  const [formData, setFormData] = useState(initialState);
  const [signup, { loading, error }] = useSignup();

  const title = displayRole === 'therapist' ? 'Therapist Signup' : 'Client Signup';
  const description = displayRole === 'therapist'
    ? 'Create your therapist account to support clients.'
    : 'Create your client account to book sessions and get support.';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input: Record<string, unknown> = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      role: apiRole,
      language: formData.language,
    };

    if (apiRole === 'therapist') {
      input.educationDegree = formData.educationDegree;
      input.specialization = formData.specialization;
      input.yearsOfExperience = Number(formData.yearsOfExperience);
    }

    const response = await signup({
      variables: {
        input,
      },
    });

    const token = response.data?.signup?.data?.token;
    const username = response.data?.signup?.data?.user?.username || formData.username;

    if (token) {
      setAuthCookies(token, username, displayRole);
      const redirectPath = displayRole === 'client' ? '/dashboard/client' : '/dashboard/therapist';
      navigate(redirectPath);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="card">
        <h1 className="heading">{title}</h1>
        <p className="subheading">{description}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          {apiRole === 'therapist' && (
            <>
              <div className="form-field">
                <label htmlFor="educationDegree">Education degree</label>
                <input
                  id="educationDegree"
                  name="educationDegree"
                  value={formData.educationDegree}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="yearsOfExperience">Years of experience</label>
                <input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-field">
            <label htmlFor="phoneNumber">Phone number</label>
            <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label htmlFor="language">Preferred language</label>
            <input id="language" name="language" value={formData.language} onChange={handleChange} required />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing up…' : 'Create account'}
          </button>
        </form>

        <div className="form-footer">
          <p className="meta-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          {error && <div className="info-box">Signup failed. Please try again.</div>}
        </div>
      </div>
    </main>
  );
};

export default SignupForm;
