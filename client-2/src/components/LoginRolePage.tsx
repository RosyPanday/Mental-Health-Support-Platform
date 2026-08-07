import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { setAuthCookies } from '../utils/auth';

const LoginRolePage = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const apiRole = role === 'therapist' ? 'therapist' : 'patient';
  const displayRole = role === 'therapist' ? 'therapist' : 'client';
  const [formState, setFormState] = useState({ username: '', password: '' });
  const [login, { loading, error, data }] = useLogin();

  const title = displayRole === 'therapist' ? 'Therapist Login' : 'Client Login';
  const description = displayRole === 'therapist'
    ? 'Enter your therapist credentials to access the platform.'
    : 'Enter your client credentials to continue.';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await login({
      variables: {
        input: {
          username: formState.username,
          password: formState.password,
          role: apiRole,
        },
      },
    });

    const token = response.data?.login?.data?.token;
    const username = response.data?.login?.data?.user?.username || formState.username;

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
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={formState.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        {error && <div className="info-box">Login failed. Check your credentials and try again.</div>}
        {data?.login?.message && <div className="info-box"><strong>{data.login.message}</strong></div>}

        <div className="form-footer">
          <p className="meta-text">
            Want to create a new account? <Link to="/signup">Sign up now</Link>
          </p>
          <Link to="/login" className="btn btn-link">
            Back to login options
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginRolePage;
