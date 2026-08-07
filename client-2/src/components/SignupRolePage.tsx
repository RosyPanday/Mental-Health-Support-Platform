import React from 'react';
import { Link } from 'react-router-dom';

const SignupRolePage = () => (
  <main className="page-wrapper">
    <div className="card">
      <h1 className="heading">Create your account</h1>
      <p className="subheading">Choose the type of account you want to register.</p>

      <div className="login-choice">
        <Link to="/signup/therapist" className="btn btn-primary">
          Sign up as Therapist
        </Link>
        <Link to="/signup/client" className="btn btn-secondary">
          Sign up as Client
        </Link>
      </div>

      <div className="form-footer">
        <p className="meta-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  </main>
);

export default SignupRolePage;
