import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; // Adjust the path as necessary

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to the login page
  };

  // Apply Bootstrap button styling here
  return (
    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
      Sign Out
    </button>
  );
};

export default LogoutButton;
