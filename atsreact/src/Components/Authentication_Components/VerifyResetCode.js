import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const VerifyResetCode = () => {
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();
    const { email } = location.state || { email: '' }; // Get email from location state

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verify reset code and reset password
            const response = await axios.post('https://ats-project-1.onrender.com/auth/reset-password', { email, resetCode, newPassword });
            setMessage(response.data.message);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            console.error('Password reset error:', err);
        }
    };

    return (
        <Container>
            <h2>Reset Password</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        readOnly
                    />
                </Form.Group>
                <Form.Group controlId="formResetCode">
                    <Form.Label>Reset Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter the reset code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Reset Password
                </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
    );
};

export default VerifyResetCode;
