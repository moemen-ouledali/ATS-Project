/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Import necessary libraries and components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useContext } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate, Link } from 'react-router-dom'; // Import navigation and link components
import { AuthContext } from '../../AuthContext'; // Import AuthContext for authentication
import '../assets/css/LoginForm.css'; // Import CSS file for styling













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the LoginForm component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LoginForm = () => {
  // State hooks to manage form inputs and messages
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [message, setMessage] = useState(''); // State for error or success messages

  const navigate = useNavigate(); // Hook to navigate programmatically
  const { setTokenAndRole } = useContext(AuthContext); // Get the setTokenAndRole function from AuthContext

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      }); // Send a POST request to login endpoint

      if (response.data.token) {
        // If login is successful, save token and role
        setTokenAndRole(
          response.data.token,
          response.data.role,
          response.data.userId,
          response.data.fullName,
          response.data.email,
          response.data.phoneNumber
        );
        navigate('/'); // Redirect to homepage or dashboard after login
      } else {
        setMessage("Login failed. Please try again."); // Set failure message
      }
    } catch (error) {
      // Handle errors during login
      if (error.response && error.response.status === 401) {
        setMessage("Incorrect Password"); // Incorrect password message
      } else if (error.response && error.response.status === 403) {
        // Redirect to verification page if the user has not verified their email
        navigate('/verify-email', { state: { email } });
      } else {
        setMessage("Login failed. Please try again."); // General failure message
      }
      console.error("Login error:", error); // Log error for debugging
    }
  };
















  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Render the login form
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <section className="vh-100"> 
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" /> 
            {/* Sample image */}
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}> 
              {/* Form submission handler */}
              <div className="form-outline mb-4">
                <input 
                  type="email" 
                  id="form3Example3" 
                  className="form-control form-control-lg" 
                  placeholder="Enter a valid email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                /> 
                {/* Email input field */}
                <label className="form-label" htmlFor="form3Example3">Email address</label>
              </div>

              <div className="form-outline mb-3">
                <input 
                  type="password" 
                  id="form3Example4" 
                  className="form-control form-control-lg" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                /> 
                {/* Password input field */}
                <label className="form-label" htmlFor="form3Example4">Password</label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Login
                </button> 
                {/* Submit button */}
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account? 
                  <a href="#!" className="link-danger">Register</a>
                </p> 
                {/* Link to registration */}
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Forgot your password? 
                  <Link to="/request-password-reset" className="link-primary">Reset it here</Link>
                </p> 
                {/* Link to password reset */}
              </div>

              {message && <div className="alert alert-danger mt-3" role="alert">
                {message}
              </div>} 
              {/* Display error message if exists */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Export the LoginForm component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default LoginForm; // Export the component for use in other parts of the application
