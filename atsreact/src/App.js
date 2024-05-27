import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext'; // Corrected import
import LoginForm from './Components/Authentication_Components/LoginForm';
import RegisterForm from './Components/Authentication_Components/RegisterForm';
import CandidateDashboard from './Components/Candidate_Components/CandidateDashboard';
import ApplicationDetails from './Components/Candidate_Components/ApplicationDetails';
import HRManagerDashboard from './Components/Manager_Components/HRManagerDashboard';
import EditProfileForm from './Components/User_Components/EditProfileForm';
import LoggedOutNav from './Components/NavigationBar_Components/LoggedOutNav';
import ManagerNav from './Components/NavigationBar_Components/ManagerNav';
import CandidateNav from './Components/NavigationBar_Components/CandidateNav';
import JobApplicants from './Components/Manager_Components/JobApplicants';
import LandingPage from './Components/LandingPage_Components/LandingPage';
import CardComponent from './Components/LandingPage_Components/CardComponent';
import JobListingsPage from './Components/Detailed_Components/JobListingsPage';
import InternshipListings from './Components/Detailed_Components/InternshipListings';
import AllJobs from './Components/Detailed_Components/AllJobs';
import JobApplicationForm from './Components/Detailed_Components/JobApplicationForm';
import AllApplications from './Components/Manager_Components/AllApplications'; 
import RequestPasswordReset from './Components/Authentication_Components/RequestPasswordReset';
import VerifyResetCode from './Components/Authentication_Components/VerifyResetCode';
import VerifyEmail from './Components/Authentication_Components/VerifyEmail'; // Import the new component


// Import the new component



function DynamicNavigation() {
    const { authToken, userRole } = useContext(AuthContext);

    if (!authToken) {
        return <LoggedOutNav />;
    }

    switch (userRole) {
        case 'Manager':
            return <ManagerNav />;
        case 'Candidate':
            return <CandidateNav />;
        default:
            return <LoggedOutNav />;
    }
}
function App() {
    return (
        <AuthProvider>
            <Router>
                <DynamicNavigation />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/request-password-reset" element={<RequestPasswordReset />} />
                    <Route path="/verify-reset-code" element={<VerifyResetCode />} />

                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/candidate_dashboard" element={<CandidateDashboard />} />
                    <Route path="/application/:id" element={<ApplicationDetails />} />
                    <Route path="/hr_manager_dashboard" element={<HRManagerDashboard />} />
                    <Route path="/edit-profile" element={<EditProfileForm />} />
                    <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
                    <Route path="/loggedoutnav" element={<LoggedOutNav />} />
                    <Route path="/card" element={<CardComponent />} />
                    <Route path="/jobs/:category" element={<JobListingsPage />} />
                    <Route path="/internships" element={<InternshipListings />} />
                    <Route path="/all-jobs" element={<AllJobs />} />
                    <Route path="/job/:id" element={<JobApplicationForm />} />
                    <Route path="/all-applications" element={<AllApplications />} /> {/* Add this line */}
                    <Route path="/verify-email" element={<VerifyEmail />} /> {/* Add this route */}


                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;