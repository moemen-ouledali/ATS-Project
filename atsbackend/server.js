const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Make sure to require jwt
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const jobListingsRoutes = require('./routes/jobListingsRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ats_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Public Routes
app.use('/auth', authRoutes);
app.get('/', (req, res) => res.send('Server is up and running'));

// JWT Authentication Middleware function
const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid Token" });
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }
};

// Use routes with selective JWT protection
app.use('/api/jobs', jobListingsRoutes); // Assume this does not require authentication globally
app.use('/api/applications', requireAuth, applicationRoutes); // Only protect this route

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
