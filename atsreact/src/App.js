import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react'; // Ensure useContext is imported here
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext'; // Ensure AuthContext is imported correctly
import LoginForm from './Components/Authentication_Components/LoginForm';
import RegisterForm from './Components/Authentication_Components/RegisterForm';
import CandidateDashboard from './Components/Candidate_Components/CandidateDashboard';
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
import JobDetailsPage from './Components/Detailed_Components/JobDetailsPage';

function App() {
    return (
        <AuthProvider> {/* Wrap all components in AuthProvider */}
            <Router>
                <DynamicNavigation />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/job/:id" element={<JobDetailsPage />} />
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
        </AuthProvider>
    );
}

function DynamicNavigation() {
    const { authToken, userRole } = useContext(AuthContext); // use AuthContext directly here

    console.log(`AuthToken: ${authToken}, UserRole: ${userRole}`);
    if (!authToken) return <LoggedOutNav />;
    return userRole === 'candidate' ? <CandidateNav /> : <ManagerNav />;
}

export default App;
