import React, { useState } from 'react'; // Importing React and useState hook
import axios from 'axios'; // Importing axios for making HTTP requests
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Importing Bootstrap components
import { useLocation } from 'react-router-dom'; // Importing useLocation hook for accessing location state







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Verify Reset Code Component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const VerifyResetCode = () => {
    const [resetCode, setResetCode] = useState(''); // State for storing reset code input
    const [newPassword, setNewPassword] = useState(''); // State for storing new password input
    const [message, setMessage] = useState(''); // State for storing success message
    const [error, setError] = useState(''); // State for storing error message

    const location = useLocation(); // Hook for accessing location state
    const { email } = location.state || { email: '' }; // Get email from location state












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Handle Form Submission
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Verify reset code and reset password
            const response = await axios.post('http://localhost:5000/auth/reset-password', { email, resetCode, newPassword });
            setMessage(response.data.message); // Set success message
        } catch (err) {
            setError('Failed to reset password. Please try again.'); // Set error message
            console.error('Password reset error:', err); // Log error to console
        }
    };











    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render the Form
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container> {/* Container for the form */}
            <h2>Reset Password</h2> {/* Form title */}
            <Form onSubmit={handleSubmit}> {/* Form submission handler */}
                <Form.Group controlId="formEmail"> {/* Form group for email display */}
                    <Form.Label>Email address</Form.Label> {/* Label for email */}
                    <Form.Control
                        type="email" // Input type
                        value={email} // Value of the input field
                        readOnly // Make input read-only
                    />
                </Form.Group>

                <Form.Group controlId="formResetCode"> {/* Form group for reset code input */}
                    <Form.Label>Reset Code</Form.Label> {/* Label for reset code */}
                    <Form.Control
                        type="text" // Input type
                        placeholder="Enter the reset code" // Placeholder text
                        value={resetCode} // Value of the input field
                        onChange={(e) => setResetCode(e.target.value)} // Update state on change
                        required // Make input required
                    />
                </Form.Group>

                <Form.Group controlId="formNewPassword"> {/* Form group for new password input */}
                    <Form.Label>New Password</Form.Label> {/* Label for new password */}
                    <Form.Control
                        type="password" // Input type
                        placeholder="Enter new password" // Placeholder text
                        value={newPassword} // Value of the input field
                        onChange={(e) => setNewPassword(e.target.value)} // Update state on change
                        required // Make input required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3"> {/* Submit button */}
                    Reset Password
                </Button>
            </Form>

            {message && <Alert variant="success" className="mt-3">{message}</Alert>} {/* Display success message */}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>} {/* Display error message */}
        </Container>
    );
};

export default VerifyResetCode; // Export the component
