// App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Import without AuthProvider
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
import BeeCodersLogo from './Media/BeeCodersLogo.png';
import JobDetails from './Components/JobDetails';
import JobApplicants from './Components/JobApplicants';
import Sidebar from './Components/SideBar';


import './App.css';

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
      <header className="App-header">
        <Link to="/">
          <img src={BeeCodersLogo} alt="BeeCoders Logo" style={{ height: '50px', marginRight: 'auto' }} />
        </Link>
        <DynamicNavigation />
      </header>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidate_dashboard" element={<CandidateDashboard />} />
        <Route path="/hr_manager_dashboard" element={<HRManagerDashboard />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
        <Route path ="SideBar" element = {<Sidebar />} />
      </Routes>
    </Router>
  );
}

export default App;
