const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';





// Set up nodemailer transporter for Outlook
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Generate a random 6-digit code
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


// POST /auth/register - Register a new user
router.post('/register', async (req, res) => {
    const { role, firstName, lastName, email, dateOfBirth, password, phoneNumber, city, highestEducationLevel } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const newUser = new User({
            role,
            firstName,
            lastName,
            email,
            dateOfBirth,
            password,
            phoneNumber,
            city,
            highestEducationLevel
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /auth/login - Log in a user and return JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            role: user.role,
            userId: user._id.toString(),
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phoneNumber: user.phoneNumber
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /auth/user/:id - Get a specific user by ID
router.get('/user/:id', async (req, res) => {
    console.log("Fetching user with ID:", req.params.id);  // This will log the ID being queried
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            console.log("No user found with ID:", req.params.id);
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Internal server error');
    }
});

// PUT /auth/user/:id - Update a specific user by ID
router.put('/user/:id', async (req, res) => {
    const { firstName, lastName, email, dateOfBirth, phoneNumber, city, highestEducationLevel } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            firstName,
            lastName,
            email,
            dateOfBirth,
            phoneNumber,
            city,
            highestEducationLevel
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// POST /auth/request-password-reset - Request password reset
router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const resetCode = generateResetCode();

        // Store the reset code and expiration time in the user document
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Your reset code is: ${resetCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending password reset email:', error);
                return res.status(500).json({ message: 'Failed to send password reset email. Please try again.' });
            }
            res.status(200).json({ message: 'Password reset code sent successfully' });
        });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST /auth/verify-reset-code - Verify reset code
router.post('/verify-reset-code', async (req, res) => {
    const { email, resetCode } = req.body;

    try {
        const user = await User.findOne({ email, resetCode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        if (Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        res.status(200).json({ message: 'Reset code verified successfully' });
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});








// POST /auth/reset-password - Reset the password
router.post('/reset-password', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, resetCode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        if (Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        user.password = newPassword;
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;