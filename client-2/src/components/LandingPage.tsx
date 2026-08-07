import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <main className="page-wrapper">
    <div className="card">
      <h1 className="heading">Mental Health Support Platform</h1>
      <p className="subheading">
        Welcome to your support platform. Sign up or log in to connect with trusted mental health care.
      </p>

      <div className="button-group">
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>

      <ul className="feature-list">
        <li>
          <span className="feature-badge">1</span>
          Personalized therapist and client onboarding
        </li>
        <li>
          <span className="feature-badge">2</span>
          Secure GraphQL signup flow with role-specific details
        </li>
        <li>
          <span className="feature-badge">3</span>
          Clean blue-green design for calm and trust
        </li>
      </ul>
    </div>
  </main>
);

export default LandingPage;
