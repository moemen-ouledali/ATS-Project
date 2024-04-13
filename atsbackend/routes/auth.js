const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const JWT_SECRET = '6969'; // Place this in your environment variables or config file

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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'your_jwt_secret', // replace with your JWT secret
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role, userId: user._id.toString() });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /user/:id - Get user details by ID
router.get('/user/:id', async (req, res) => {
    // your existing code...
});

// PUT /user/:id - Update user details
router.put('/user/:id', async (req, res) => {
    // your existing code...
});

module.exports = router;
