import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => (
  <main className="page-wrapper">
    <div className="card">
      <h1 className="heading">Login</h1>
      <p className="subheading">Choose how you want to sign in.</p>
      <div className="login-choice">
        <Link to="/login/therapist" className="btn btn-primary">
          Login as Therapist
        </Link>
        <Link to="/login/client" className="btn btn-secondary">
          Login as Client
        </Link>
      </div>
      <div className="form-footer">
        <p className="meta-text">
          Need a new account? <Link to="/signup">Sign up instead</Link>
        </p>
      </div>
    </div>
  </main>
);

export default LoginPage;
