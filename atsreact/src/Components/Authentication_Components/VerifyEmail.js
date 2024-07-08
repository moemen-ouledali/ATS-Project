import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Component for verifying email
const VerifyEmail = () => {



  const [email, setEmail] = useState(''); // State to store email input
  const [code, setCode] = useState(''); // State to store verification code input
  const [message, setMessage] = useState(''); // State to store response message
  const navigate = useNavigate(); // Get the navigate function from useNavigate




  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  // Function to handle form submission
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send verification request to the server
      const response = await axios.post('http://localhost:5000/auth/verify-code', { email, code });
      setMessage(response.data.message); // Set response message
      if (response.status === 200) {
        navigate('/login'); // Redirect to login page upon successful verification
      }
    } catch (error) {
      setMessage("Verification failed. Please try again."); // Set error message
      console.error("Verification error:", error); // Log error to console
    }
  };











  return (
    <div className="container mt-5">
      <h2>Verify Your Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Verify</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default VerifyEmail;
