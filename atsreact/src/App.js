// atsreact/src/App.js

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
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
import JobApplicationFormUnauth from './Components/Detailed_Components/JobApplicationForm_Unauth';
import AllApplications from './Components/Manager_Components/AllApplications';
import RequestPasswordReset from './Components/Authentication_Components/RequestPasswordReset';
import VerifyResetCode from './Components/Authentication_Components/VerifyResetCode';
import VerifyEmail from './Components/Authentication_Components/VerifyEmail';
import TestPage from './Components/User_Components/TestPage'; // Ensure this path is correct
import ManagerTestAttempts from './Components/Manager_Components/ManagerTestAttempts'; // New component
import UserManagement from './Components/Admin_Components/UserManagement';
import AdminNav from './Components/NavigationBar_Components/AdminNav'; // Ensure the import path is correct
import AnalyticsDashboard from './Components/Manager_Components/HRManagerAnalytics'; // Import the AnalyticsDashboard

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
        case 'Admin':
            return <AdminNav />;
        default:
            return <LoggedOutNav />;
    }
}

function App() {
    const { userRole } = useContext(AuthContext);

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
                    <Route
                        path="/job/:id"
                        element={
                            userRole === 'Candidate' ? <JobApplicationForm /> : <JobApplicationFormUnauth />
                        }
                    />
                    <Route path="/all-applications" element={<AllApplications />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/test/:category" element={<TestPage />} />
                    <Route path="/manager-test-attempts" element={<ManagerTestAttempts />} /> {/* New route */}
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin_dashboard" element={<UserManagement />} />
                    <Route path="/hr-manager-analytics" element={<AnalyticsDashboard />} /> {/* Add AnalyticsDashboard Route */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
