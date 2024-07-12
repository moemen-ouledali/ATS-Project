// routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const Interview = require('../models/interview');

// GET all interviews
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find().populate('applicationId');
    res.json(interviews);
  } catch (error) {
    res.status(500).send('Error fetching interviews: ' + error.message);
  }
});

router.get('/applications/:id', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Failed to fetch application details:', error);
    res.status(500).send('Error fetching application details');
  }
});







module.exports = router;
