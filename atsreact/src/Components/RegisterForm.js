import React, { useState } from 'react';
import axios from 'axios';
import ToastNotification from './ToastNotification'; // Adjust the import path as needed

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Added role state with default value
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Attempt to send a POST request to the backend with user data
      await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password,
        role, // Include the role in the request
      });

      // On successful registration
      setToastMessage("Registration successful! 🚀 ");
      setShowToast(true);

      // Optionally reset form fields here if needed
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('candidate');

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Use the backend's error message if available
        setToastMessage(error.response.data.message);
      } else {
        // Fallback error message
        setToastMessage("Registration failed. Please try again.");
      }
      setShowToast(true);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      {showToast && (
        <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default RegisterForm;
