const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to fetch user by email
router.get('/email/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
