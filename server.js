const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const jobListingsRoutes = require('./routes/jobListingsRoutes'); // Import job listings routes
const jobApplicationsRoutes = require('./routes/jobApplicationsRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/api/jobs', jobListingsRoutes);
app.use('/api/jobapplications', jobApplicationsRoutes);

// Add a route to get a job listing by ID
app.get('/api/jobs/:jobId', async (req, res) => {
    const jobId = req.params.jobId;
    try {
        const job = await JobListing.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job listing not found' });
        }
        res.json(job);
    } catch (error) {
        console.error('Error fetching job listing by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/api/jobapplications/all-details', async (req, res) => {
    try {
      const allApplications = await JobApplication.find().populate('applicantId jobId');
      res.json(allApplications);
    } catch (error) {
      console.error('Error fetching all job applications:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ats_database', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
