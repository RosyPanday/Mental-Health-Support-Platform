import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import LoginRolePage from './components/LoginRolePage';
import SignupRolePage from './components/SignupRolePage';
import SignupForm from './components/SignupForm';
import DashboardPage from './components/DashboardPage';
import DepressionScreeningPage from './components/DepressionScreeningPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupRolePage />} />
        <Route path="/signup/:role" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:role" element={<LoginRolePage />} />
        <Route path="/dashboard/client" element={<DepressionScreeningPage />} />
        <Route path="/dashboard/therapist" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
