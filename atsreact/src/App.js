import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
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



function DynamicNavigation() {
    const { authToken, userRole } = useContext(AuthContext);

    console.log(`AuthToken: ${authToken}, UserRole: ${userRole}`);  // This helps you debug the values being passed.

    if (!authToken) {
        console.error('No auth token found or AuthContext is not available');
        return <LoggedOutNav />;
    }

    return userRole === 'manager' ? <ManagerNav /> : userRole === 'candidate' ? <CandidateNav /> : <LoggedOutNav />;
}


function App() {
    return (
        <AuthProvider>
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

<<<<<<< HEAD
function DynamicNavigation() {
    const { authToken, userRole } = useContext(AuthContext);
    console.log(`UserRole: ${userRole}`);  // Check the logged user role
    const [renderKey, setRenderKey] = useState(0); // Used to force a rerender

    useEffect(() => {
        console.log("Current user role:", userRole); // Debug output to monitor changes
        // Only force a rerender if certain conditions are met
        if (authToken && userRole) {
            setRenderKey(prev => prev + 1); // Increment key to force rerender
        }
    }, [authToken, userRole]);

    if (!authToken) {
        return <LoggedOutNav />;
    }

    return (
        <div key={renderKey}>
            {userRole === 'Manager' ? <ManagerNav /> : <CandidateNav />}
        </div>
    );
}
=======

>>>>>>> parent of af34368 (test navbar)



export default App;
