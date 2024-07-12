import React, { useState } from 'react'; // Importing React and useState hook
import axios from 'axios'; // Importing axios for making HTTP requests
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Importing components from react-bootstrap
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Request Password Reset Component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const RequestPasswordReset = () => {
    const [email, setEmail] = useState(''); // State for storing email input
    const [message, setMessage] = useState(''); // State for storing success message
    const [error, setError] = useState(''); // State for storing error message
    const navigate = useNavigate(); // Hook for navigating to different routes











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Handle Form Submission
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await axios.post('http://localhost:5000/auth/request-password-reset', { email }); // Send POST request to backend
            setMessage(response.data.message); // Set success message
            navigate('/verify-reset-code', { state: { email } }); // Navigate to verify reset code page
        } catch (err) {
            setError('Failed to send password reset email. Please try again.'); // Set error message
            console.error('Password reset request error:', err); // Log error to console
        }
    };












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render the Form
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container> {/* Container for the form */}
            <h2>Request Password Reset</h2> {/* Form title */}
            <Form onSubmit={handleSubmit}> {/* Form submission handler */}
                <Form.Group controlId="formEmail"> {/* Form group for email input */}
                    <Form.Label>Email address</Form.Label> {/* Label for email input */}
                    <Form.Control
                        type="email" // Input type
                        placeholder="Enter your email" // Placeholder text
                        value={email} // Value of the input field
                        onChange={(e) => setEmail(e.target.value)} // Update state on change
                        required // Make input required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3"> {/* Submit button */}
                    Send Reset Code
                </Button>
            </Form>

            {message && <Alert variant="success" className="mt-3">{message}</Alert>} {/* Success message alert */}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>} {/* Error message alert */}
        </Container>
    );
};






export default RequestPasswordReset; // Export the component
