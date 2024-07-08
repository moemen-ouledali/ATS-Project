import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; // Adjust the path to your AuthContext if needed
import '../assets/css/LoginForm.css'; // Ensure the CSS path matches your project structure

const LoginForm = () => {




  
  // State variables to manage email, password, and message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');







  // Hook to navigate to different routes
  const navigate = useNavigate();








  // Get setTokenAndRole function from AuthContext
  const { setTokenAndRole } = useContext(AuthContext);







  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      // Check if token is received, then set it in context and navigate to homepage
      if (response.data.token) {
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
        setMessage("Login failed. Please try again."); // Set error message if login fails
      }
    } 
    catch (error) {
      // Handle different error responses from the server
      if (error.response && error.response.status === 401) { // Code 401 = unauthorized 
        setMessage("Incorrect Password");
      } else if (error.response && error.response.status === 403) { // Code 401 = forbidden
        // Redirect to verification page if the user has not verified their email
        navigate('/verify-email', { state: { email } });
      } else {
        setMessage("Login failed. Please try again.");
      }
      console.error("Login error:", error); // Log error to console
    }
  };


















  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            {/* Image on the left side */}
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            {/* Login form */}
            <form onSubmit={handleSubmit}>
              <div className="form-outline mb-4">
                {/* Email input field */}
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
              </div>

              <div className="form-outline mb-3">
                {/* Password input field */}
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                {/* Login button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Login
                </button>
                {/* Link to Register page */}
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{' '}
                  <a href="#!" className="link-danger">
                    Register
                  </a>
                </p>
                {/* Link to password reset page */}
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Forgot your password?{' '}
                  <Link to="/request-password-reset" className="link-primary">
                    Reset it here
                  </Link>
                </p>
              </div>

              {/* Display message if any */}
              {message && (
                <div className="alert alert-danger mt-3" role="alert">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
