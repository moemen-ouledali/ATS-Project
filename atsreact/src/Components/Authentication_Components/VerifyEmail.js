import React, { useState } from 'react'; // Importing React and useState hook
import axios from 'axios'; // Importing axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Verify Email Component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const VerifyEmail = () => {
  const [email, setEmail] = useState(''); // State for storing email input
  const [code, setCode] = useState(''); // State for storing verification code input
  const [message, setMessage] = useState(''); // State for storing success/error message
  const navigate = useNavigate(); // Hook for navigating to different routes









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Handle Form Submission
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post('http://localhost:5000/auth/verify-code', { email, code }); // Send POST request to backend
      setMessage(response.data.message); // Set success/error message

      if (response.status === 200) { // Check if response status is 200 (OK)
        navigate('/login'); // Navigate to login page
      }
    } catch (error) {
      setMessage("Verification failed. Please try again."); // Set error message
      console.error("Verification error:", error); // Log error to console
    }
  };











  


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render the Form
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mt-5"> {/* Container for the form */}
      <h2>Verify Your Email</h2> {/* Form title */}
      <form onSubmit={handleSubmit}> {/* Form submission handler */}
        <div className="form-group"> {/* Form group for email input */}
          <label>Email address</label> {/* Label for email input */}
          <input
            type="email" // Input type
            className="form-control" // Input class
            value={email} // Value of the input field
            onChange={(e) => setEmail(e.target.value)} // Update state on change
            required // Make input required
          />
        </div>

        <div className="form-group"> {/* Form group for verification code input */}
          <label>Verification Code</label> {/* Label for verification code input */}
          <input
            type="text" // Input type
            className="form-control" // Input class
            value={code} // Value of the input field
            onChange={(e) => setCode(e.target.value)} // Update state on change
            required // Make input required
          />
        </div>

        <button type="submit" className="btn btn-primary">Verify</button> {/* Submit button */}
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>} {/* Display success/error message */}
    </div>
  );
};

export default VerifyEmail; // Export the component
