const express = require('express'); // Import Express
const router = express.Router(); // Create a new router object
const Interview = require('../models/interview'); // Import Interview model









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get all interviews
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {
  try {
    // Find all interviews and populate the applicationId field
    const interviews = await Interview.find().populate('applicationId');
    // Send the interviews as response
    res.json(interviews);
  } catch (error) {
    // Send an error response if there's an issue
    res.status(500).send('Error fetching interviews: ' + error.message);
  }
});













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get a specific application by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/applications/:id', async (req, res) => {
  try {
    const applicationId = req.params.id; // Get the application ID from the request parameters
    // Find the application by ID and populate the jobId field
    const application = await Application.findById(applicationId).populate('jobId');

    if (!application) {
      // If no application found, send a 404 response
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send the application details as response
    res.json(application);
  } catch (error) {
    console.error('Failed to fetch application details:', error);
    // Send an error response if there's an issue
    res.status(500).send('Error fetching application details');
  }
});











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router; // Export the router
