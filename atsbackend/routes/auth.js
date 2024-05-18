const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // Use environment variable for JWT secret

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

module.exports = router;