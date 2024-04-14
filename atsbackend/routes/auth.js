const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// It's better to keep your secrets outside your codebase
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // Use environment variable for JWT secret

// POST /register - Register a new user
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

// POST /login - Log in a user and return JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || password !== user.password) { // This should ideally be a hashed password check
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Include additional user details in the response
        res.json({
            token,
            role: user.role,
            userId: user._id.toString(),
            fullName: `${user.firstName} ${user.lastName}`, // Combining first and last name
            email: user.email,
            phoneNumber: user.phoneNumber
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Other routes (GET /user/:id, PUT /user/:id) should also be updated to handle user details appropriately
// Ensure you replace this comment with your existing GET and PUT handlers if they are used in your application.

module.exports = router;
