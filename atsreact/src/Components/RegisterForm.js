import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  // Initialize state for form fields, role, and message
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Added role state with default value
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload

    // Clear previous messages
    setMessage('');

    try {
      // Attempt to send a POST request to the backend with the role included
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password,
        role, // Include the role in the request
      });

      // Set a success message (or use response.data.message if your API responds with a message)
      setMessage("Registration successful!");

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display the backend's error message
        setMessage(error.response.data.message);
      } else {
        // Generic error message if response structure is different
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div>
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        {/* Email input */}
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        {/* Password input */}
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {/* Role selection dropdown */}
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="hr_manager">HR Manager</option>
          </select>
        </div>
        {/* Submit button */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
