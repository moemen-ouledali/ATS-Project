import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton'; // Adjust the import path as necessary
import beeCodersLogo from '../../Media/BeeCodersLogo.png'; // Adjust the import path to where your logo is located

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import your project's CSS
import '../../bootstrap LP/css/styles.css'; // Adjust the path according to your project structure
import '../../App.css';

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
                            <Link className="nav-link" to="/candidate_dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/edit-profile">Edit Profile</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link btn btn-link" style={{ padding: 0, border: 'none', background: 'none' }}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default CandidateNav;
