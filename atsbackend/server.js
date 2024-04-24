const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const jobListingsRoutes = require('./routes/jobListingsRoutes');
const applicationRoutes = require('./routes/applicationRoutes'); // ensure path correctness

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ats_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middlewares
app.use(cors()); // enabling CORS for all requests
app.use(express.json()); // for parsing application/json
app.use(fileUpload()); // Add file upload support

// Use routes
app.use('/auth', authRoutes);
app.use('/api/jobs', jobListingsRoutes);
app.use('/api/jobapplications', applicationRoutes); // mounting the routes

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
