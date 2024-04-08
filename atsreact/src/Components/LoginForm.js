import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Adjust the path to your AuthContext if needed
import './assets/css/LoginForm.css'; // Ensure the CSS path matches your project structure

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setTokenAndRole } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        setTokenAndRole(response.data.token, response.data.role, response.data.userId); // Adapt if your response structure is different
        localStorage.setItem('userId', response.data.userId); // Adjust according to your authentication mechanism
        navigate('/dashboard'); // Adjust as necessary
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      // Check if the backend response can be interpreted as an incorrect password
      if (error.response && error.response.status === 401) { // Adjust the condition based on your backend response
        setMessage("Incorrect Password");
      } else {
        setMessage("Login failed. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-twitter"></i>
                </button>
                <button type="button" className="btn btn-primary btn-floating mx-1">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Or</p>
              </div>

              <div className="form-outline mb-4">
                <input type="email" id="form3Example3" className="form-control form-control-lg" placeholder="Enter a valid email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label className="form-label" htmlFor="form3Example3">Email address</label>
              </div>

              <div className="form-outline mb-3">
                <input type="password" id="form3Example4" className="form-control form-control-lg" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label className="form-label" htmlFor="form3Example4">Password</label>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                  <label className="form-check-label" for="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-body">Forgot password?</a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Login</button>
                <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!" className="link-danger">Register</a></p>
              </div>

              {message && <div className="alert alert-danger mt-3" role="alert">
                {message}
              </div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
