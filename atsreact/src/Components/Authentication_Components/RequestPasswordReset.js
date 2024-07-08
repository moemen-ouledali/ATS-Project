import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';





// Component for requesting a password reset
const RequestPasswordReset = () => {








    const [email, setEmail] = useState(''); // State to store email input
    const [message, setMessage] = useState(''); // State to store success message
    const [error, setError] = useState(''); // State to store error message
    const navigate = useNavigate(); // Get the navigate function from useNavigate





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // Function to handle form submission
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send password reset request to the server
            const response = await axios.post('http://localhost:5000/auth/request-password-reset', { email });
            setMessage(response.data.message); // Set success message
            // Redirect to the verify reset code page after successfully sending the reset code
            navigate('/verify-reset-code', { state: { email } });
        } catch (err) {
            setError('Failed to send password reset email. Please try again.'); // Set error message
            console.error('Password reset request error:', err); // Log error to console
        }
    };






    return (
        <Container>
            <h2>Request Password Reset</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Send Reset Code
                </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
    );
};

export default RequestPasswordReset;
