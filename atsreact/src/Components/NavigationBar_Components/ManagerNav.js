import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; // Ensure the path is correct
import beeCodersLogo from '../../Media/BeeCodersLogo.png'; // Adjust the path to your logo

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import your project's CSS
import '../../bootstrap LP/css/styles.css'; // Adjust the path according to your project structure
import '../../App.css';

const ManagerNav = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate(); // Replace useHistory with useNavigate

    const handleLogout = () => {
        logout();
        navigate('/login'); // Use navigate in place of history.push
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
            <div className="container px-5">
                <Link className="navbar-brand" to="/">
                    <img src={beeCodersLogo} alt="Bee Coders Logo" style={{ height: '50px' }} />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarManager"
                    aria-controls="navbarManager"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarManager">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                        <li className="nav-item">
                            <Link className="nav-link" to="/hr_manager_dashboard">Dashboard MANAGER</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/edit-profile">Edit Profile MANAGER</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link btn btn-link" style={{ padding: 0 }}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default ManagerNav;
