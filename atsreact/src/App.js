
// App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import Dashboard from './Components/Dashboard';
import CandidateDashboard from './Components/CandidateDashboard';
import HRManagerDashboard from './Components/HRManagerDashboard';
import EditProfileForm from './Components/EditProfileForm';
import HomePage from './Components/HomePage';
import LoggedOutNav from './Components/LoggedOutNav';
import ManagerNav from './Components/ManagerNav';
import CandidateNav from './Components/CandidateNav';

import JobApplicants from './Components/JobApplicants';
import LandingPage from './Components/LandingPage';
import CardComponent from './Components/CardComponent';
import JobListingsPage from './Components/JobListingsPage';
import InternshipListings from './Components/InternshipListings';
import AllJobs from './Components/AllJobs';
import JobDetailsPage from './Components/JobDetailsPage';

function App() {
  const { authToken } = useContext(AuthContext);
  const userRole = localStorage.getItem('role');

  const DynamicNavigation = () => {
    console.log(`AuthToken: ${authToken}, UserRole: ${userRole}`);
    if (!authToken) return <LoggedOutNav />;
    return userRole === 'candidate' ? <CandidateNav /> : <ManagerNav />;
  };

  return (
    <Router>
        <DynamicNavigation />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidate_dashboard" element={<CandidateDashboard />} />
        <Route path="/hr_manager_dashboard" element={<HRManagerDashboard />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/loggedoutnav" element={<LoggedOutNav />} />
        <Route path="/card" element={<CardComponent />} />
        <Route path="/jobs/:category" element={<JobListingsPage />} />
        <Route path="/internships" element={<InternshipListings />} />
        <Route path="/all-jobs" element={<AllJobs />} />
        



      </Routes>
    </Router>
  );
}

export default App;
