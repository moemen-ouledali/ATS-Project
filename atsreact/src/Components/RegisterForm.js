import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // If you need to navigate after register
import './assets/css/LoginForm.css'; // Assuming this CSS file has styles for your form

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Assuming 'candidate' is a valid role
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // If you need to navigate after register

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adjust the endpoint and body as necessary for your backend API
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password,
        role,
      });

      // Navigate or display a success message
      navigate('/login'); // or '/dashboard' depending on your flow
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            {/* Replace with your actual image for the registration page */}
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              {/* Same structure as LoginForm */}
              <div className="form-outline mb-4">
                <input type="text" id="username" className="form-control form-control-lg" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label className="form-label" htmlFor="username">Username</label>
              </div>

              <div className="form-outline mb-4">
                <input type="email" id="email" className="form-control form-control-lg" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label className="form-label" htmlFor="email">Email address</label>
              </div>

              <div className="form-outline mb-4">
                <input type="password" id="password" className="form-control form-control-lg" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label className="form-label" htmlFor="password">Password</label>
              </div>

              <div className="form-outline mb-4">
                <select id="role" className="form-select form-select-lg" value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="candidate">Candidate</option>
                  <option value="hr_manager">HR Manager</option>
                  {/* Add other roles as necessary */}
                </select>
                <label className="form-label" htmlFor="role">Role</label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Register</button>
                <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="#!" className="link-danger">Login</a></p>
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

export default RegisterForm;
