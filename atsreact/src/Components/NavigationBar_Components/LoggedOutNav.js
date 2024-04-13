import React from 'react';
import { Link } from 'react-router-dom';
import beeCodersLogo from '../../Media/BeeCodersLogo.png'; // Adjust the import path to where your logo is located



// Import CSS
import '../../bootstrap LP/css/styles.css'; // Adjust the path according to your project structure
// Import images





import 'bootstrap/dist/css/bootstrap.min.css'; // This assumes you've installed Bootstrap via npm
import '../../App.css'

const LoggedOutNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container px-5">
        <a className="navbar-brand" href="/">
          <img src={beeCodersLogo} alt="Bee Coders Logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarLoggedOut"
          aria-controls="navbarLoggedOut"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarLoggedOut">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LoggedOutNav;
