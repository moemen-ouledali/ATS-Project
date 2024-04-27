const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// Use routes
app.use('/auth', authRoutes);
app.use('/api/jobs', jobListingsRoutes);
app.use('/api/applications', applicationRoutes); // Ensure this matches your frontend API call

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
