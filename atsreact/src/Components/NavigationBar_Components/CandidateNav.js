import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; // Ensure this path is correct
import beeCodersLogo from '../../Media/BeeCodersLogo.png'; // Adjust the path to your logo
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported correctly
import '../../App.css'; // Ensure the path to your App CSS is correct

const CandidateNav = () => {
    const { logout } = useContext(AuthContext); // Use logout from AuthContext
    const navigate = useNavigate(); // Use useNavigate for redirection
    
    // Fully implemented handleLogout function
    const handleLogout = () => {
        console.log("Logging out...");
        logout(); // Clear your AuthContext
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={beeCodersLogo} alt="Bee Coders Logo" style={{ height: '50px' }} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedCandidate" aria-controls="navbarSupportedCandidate" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedCandidate">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/candidate_dashboard">Dashboard Candidate</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/edit-profile">Edit Profile Candidate ! </Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link btn btn-link" style={{ padding: 0, border: 'none', background: 'none' }}>
                                Logout Candidate
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default CandidateNav;
