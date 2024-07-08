// Import necessary modules
const express = require('express');
const router = express.Router();
const Interview = require('../models/interview');














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET all interviews
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/', async (req, res) => {
  try {
    // Find all interviews and populate the 'applicationId' field with related data
    const interviews = await Interview.find().populate('applicationId');
    // Send the list of interviews as a JSON response
    res.json(interviews);
  } catch (error) {
    // Send an error response if there was an issue fetching the interviews
    res.status(500).send('Error fetching interviews: ' + error.message);
  }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET application details by application ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/applications/:id', async (req, res) => {
  try {
    // Extract the application ID from the request parameters
    const applicationId = req.params.id;
    // Find the application by ID and populate the 'jobId' field with related data
    const application = await Application.findById(applicationId).populate('jobId');

    // Check if the application was found
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send the application details as a JSON response
    res.json(application);
  } catch (error) {
    // Log and send an error response if there was an issue fetching the application details
    console.error('Failed to fetch application details:', error);
    res.status(500).send('Error fetching application details');
  }
});












// Export the router so it can be used in the main application
module.exports = router;
