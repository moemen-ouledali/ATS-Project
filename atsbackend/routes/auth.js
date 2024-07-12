const express = require('express'); // Import Express
const router = express.Router(); // Create a new router object
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken'); // Import JSON Web Token library
const nodemailer = require('nodemailer'); // Import Nodemailer for sending emails
const crypto = require('crypto'); // Import crypto for generating random values
const JWT_SECRET = 'your_jwt_secret_here'; // JWT secret key for signing tokens












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Email credentials and transporter setup
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const EMAIL_USER = 'BeeApply.reset@outlook.com'; // Email user for sending emails
const EMAIL_PASS = 'beeapply2024'; // Email password

// Set up Nodemailer transporter for Outlook
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // SMTP host for Outlook
    port: 587, // Port for Outlook
    secure: false, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    logger: true, // Enable logger
    debug: true // Enable debug output
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to generate a random 6-digit verification code
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit random code
};











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to register a new user
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/register', async (req, res) => {
    const { role, firstName, lastName, email, dateOfBirth, password, phoneNumber, city, highestEducationLevel, gender } = req.body;

    try {
        let existingUser = await User.findOne({ email }); // Check if the email is already registered
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" }); // If email exists, return an error
        }

        const verificationCode = generateVerificationCode(); // Generate a verification code

        const newUser = new User({
            role,
            firstName,
            lastName,
            email,
            dateOfBirth,
            password,
            phoneNumber,
            city: role === 'Manager' ? undefined : city,
            highestEducationLevel: role === 'Manager' ? undefined : highestEducationLevel,
            gender,
            verificationCode,
            isVerified: role === 'Manager' ? true : false
        });

        await newUser.save(); // Save the new user to the database

        // Send verification code to user's email
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Email Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <div style="background-color: #4A90E2; padding: 20px; color: #fff; text-align: center;">
                        <h1 style="margin: 0;">BeeApply Verification</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear ${firstName} ${lastName},</p>
                        <p>Thank you for registering at BeeApply. To complete your registration, please use the following verification code:</p>
                        <div style="background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; text-align: center; font-size: 20px; font-weight: bold;">
                            ${verificationCode}
                        </div>
                        <p>If you did not request this, please ignore this email.</p>
                        <p>Best regards,</p>
                        <p>BeeApply Team</p>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #aaa;">
                        &copy; 2024 ATS. All rights reserved.
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification code email:', error);
                return res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
            }
            res.status(201).json({ message: 'User registered successfully. Verification code sent to email.' });
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to verify the user's code
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email, verificationCode: code }); // Find user with the provided email and code
        if (!user) {
            return res.status(400).json({ message: 'Invalid verification code' }); // If no user found, return an error
        }

        user.isVerified = true; // Mark the user as verified
        user.verificationCode = null; // Clear the verification code
        await user.save(); // Save the changes

        res.status(200).json({ message: 'Email verified successfully' }); // Send success response
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to log in a user and return JWT
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }); // Find user by email
        if (!user || password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" }); // If no user found or password is incorrect, return an error
        }

        if (!user.isVerified) {
            // Generate a new verification code
            const verificationCode = generateVerificationCode();
            user.verificationCode = verificationCode;
            await user.save();

            // Send the verification code to the user's email
            const mailOptions = {
                from: EMAIL_USER,
                to: email,
                subject: 'Email Verification Code',
                text: `Your verification code is: ${verificationCode}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification code email:', error);
                    return res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
                }
                return res.status(403).json({ message: 'Please verify your email. A new verification code has been sent to your email.' });
            });

            return; // Ensure response is sent and function does not continue
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        ); // Create a JWT token

        res.json({
            token,
            role: user.role,
            userId: user._id.toString(),
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phoneNumber: user.phoneNumber
        }); // Send the token and user details as response
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get a specific user by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/user/:id', async (req, res) => {
    console.log("Fetching user with ID:", req.params.id);  // This will log the ID being queried
    try {
        const user = await User.findById(req.params.id); // Find user by ID
        if (!user) {
            console.log("No user found with ID:", req.params.id);
            return res.status(404).send('User not found'); // If no user found, return an error
        }
        res.json(user); // Send the user details as response
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Internal server error');
    }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to update a specific user by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/user/:id', async (req, res) => {
    const { firstName, lastName, email, dateOfBirth, phoneNumber, city, highestEducationLevel, gender } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            firstName,
            lastName,
            email,
            dateOfBirth,
            phoneNumber,
            city,
            highestEducationLevel,
            gender // Add this line
        }, { new: true }); // Update user details

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If no user found, return an error
        }

        res.json({ message: "User updated successfully", user }); // Send success response
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to request password reset
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: "Email not found" }); // If no user found, return an error
        }

        const resetCode = generateVerificationCode(); // Generate a reset code

        // Store the reset code and expiration time in the user document
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 3600000; // 1 hour from now
        await user.save(); // Save the changes

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Your reset code is: ${resetCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending password reset email:', error);
                return res.status(500).json({ message: 'Failed to send password reset email. Please try again.' });
            }
            res.status(200).json({ message: 'Password reset code sent successfully' }); // Send success response
        });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to verify reset code
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/verify-reset-code', async (req, res) => {
    const { email, resetCode } = req.body;

    try {
        const user = await User.findOne({ email, resetCode }); // Find user with the provided email and reset code
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' }); // If no user found or code is invalid, return an error
        }

        if (Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ message: 'Reset code has expired' }); // If reset code has expired, return an error
        }

        res.status(200).json({ message: 'Reset code verified successfully' }); // Send success response
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to change the password
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId); // Find user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // If no user found, return an error
        }

        if (user.password !== currentPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' }); // If current password is incorrect, return an error
        }

        user.password = newPassword; // Update the password
        await user.save(); // Save the changes
        res.json({ message: 'Password changed successfully' }); // Send success response
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to reset the password
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/reset-password', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, resetCode }); // Find user with the provided email and reset code
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' }); // If no user found or code is invalid, return an error
        }

        if (Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ message: 'Reset code has expired' }); // If reset code has expired, return an error
        }

        user.password = newPassword; // Update the password
        user.resetCode = undefined; // Clear the reset code
        user.resetCodeExpires = undefined; // Clear the reset code expiration
        await user.save(); // Save the changes

        res.json({ message: 'Password reset successfully' }); // Send success response
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get all users
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Find all users
        res.json(users); // Send the user details as response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});





















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to update user role
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/user/:id/role', async (req, res) => {
    try {
        const { role } = req.body; // Get the new role from request body
        const userId = req.params.id; // Get the user ID from request parameters
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }); // Update the user role
        res.json(user); // Send the updated user details as response
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send('Error updating user role');
    }
});












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router; // Export the router
