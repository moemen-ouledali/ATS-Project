/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Import necessary modules and models
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const JobListing = require('../models/JobListing');
const TestAttempt = require('../models/TestAttempt');
const User = require('../models/User'); // Ensure the path to the User model is correct





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get application status distribution
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/application-status', async (req, res) => {
  try {
    // Fetch all applications from the database
    const applications = await Application.find({});

    // Count the number of applications for each status
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    // Prepare the data for the response
    const data = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colors for the chart
      }]
    };

    console.log('Application Status Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch application status data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applications over time
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/applications-over-time', async (req, res) => {
  try {
    // Aggregate applications by date
    const applications = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 } // Count the number of applications per day
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1 // Sort by date
        }
      }
    ]);

    // Prepare the data for the response
    const data = {
      labels: applications.map(app => `${app._id.year}-${app._id.month}-${app._id.day}`),
      datasets: [{
        data: applications.map(app => app.count),
        backgroundColor: '#4A90E2', // Color for the chart
        borderColor: '#357ABD',
        fill: false // Do not fill the area under the line
      }]
    };

    console.log('Applications Over Time Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch applications over time data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});








/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by education level
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/education-level', async (req, res) => {
  try {
    // Fetch all applications from the database
    const applications = await Application.find({});

    // Count the number of applications for each education level
    const educationCounts = applications.reduce((acc, app) => {
      acc[app.educationLevel] = (acc[app.educationLevel] || 0) + 1;
      return acc;
    }, {});

    // Prepare the data for the response
    const data = {
      labels: Object.keys(educationCounts),
      datasets: [{
        data: Object.values(educationCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Colors for the chart
      }]
    };

    console.log('Education Level Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch education level data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by experience level
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/experience-level', async (req, res) => {
  try {
    // Fetch all applications from the database
    const applications = await Application.find({});

    // Count the number of applications for each experience level
    const experienceCounts = applications.reduce((acc, app) => {
      acc[app.experienceLevel] = (acc[app.experienceLevel] || 0) + 1;
      return acc;
    }, {});

    // Prepare the data for the response
    const data = {
      labels: Object.keys(experienceCounts),
      datasets: [{
        data: Object.values(experienceCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Colors for the chart
      }]
    };

    console.log('Experience Level Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch experience level data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applications per job category
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/applications-per-category', async (req, res) => {
  try {
    // Fetch all job listings from the database
    const jobListings = await JobListing.find({});

    // Count the number of applications for each job category
    const categoryCounts = jobListings.reduce((acc, job) => {
      acc[job.category] = (acc[job.category] || 0) + 1;
      return acc;
    }, {});

    // Prepare the data for the response
    const data = {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Colors for the chart
      }]
    };

    console.log('Applications Per Category Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch applications per category data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get test scores distribution
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/test-scores', async (req, res) => {
  try {
    // Fetch all test attempts from the database
    const testAttempts = await TestAttempt.find({});
    const scores = testAttempts.map(attempt => attempt.score); // Extract the scores

    // Prepare the data for the response
    const data = {
      labels: scores, // Use scores as labels
      datasets: [{
        data: scores, // Use scores as data
        backgroundColor: '#4A90E2' // Color for the chart
      }]
    };

    console.log('Test Scores Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch test scores data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by university
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/top-universities', async (req, res) => {
  try {
    // Fetch all applications from the database
    const applications = await Application.find({});

    // Count the number of applications for each university
    const universityCounts = applications.reduce((acc, app) => {
      if (app.university) {
        acc[app.university] = (acc[app.university] || 0) + 1;
      }
      return acc;
    }, {});

    // Prepare the data for the response
    const data = {
      labels: Object.keys(universityCounts),
      datasets: [{
        data: Object.values(universityCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Colors for the chart
      }]
    };

    console.log('Top Universities Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch university data:', error);
    res.status(500).send('Server Error'); // Send a server error response
  }
});









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by city
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/applicants-by-city', async (req, res) => {
  try {
    // Aggregate applications by joining with users to get city information
    const applicantsByCity = await Application.aggregate([
      {
        $lookup: {
          from: 'users', // Collection name in MongoDB
          localField: 'email', // Field from the Application schema
          foreignField: 'email', // Field from the User schema
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $group: {
          _id: '$userDetails.city',
          count: { $sum: 1 } // Count the number of applications per city
        }
      },
      {
        $project: {
          city: '$_id',
          count: 1,
          _id: 0 // Exclude the _id field
        }
      }
    ]);

    // Format the data for the frontend
    const labels = applicantsByCity.map(item => item.city || 'Unknown'); // Use 'Unknown' for null cities
    const data = applicantsByCity.map(item => item.count); // Extract counts

    res.json({
      labels,
      datasets: [
        {
          label: 'Applicants by City',
          data,
          backgroundColor: '#36A2EB' // Color for the chart
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching applicants by city:', error);
    res.status(500).json({ error: 'Error fetching applicants by city' }); // Send a server error response
  }
});





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get gender distribution
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/gender', async (req, res) => {
  try {
    // Count the number of male and female users
    const maleCount = await User.countDocuments({ gender: 'male' });
    const femaleCount = await User.countDocuments({ gender: 'female' });

    // Prepare the data for the response
    const data = {
      labels: ['Male', 'Female'],
      datasets: [
        {
          data: [maleCount, femaleCount],
          backgroundColor: ['#36A2EB', '#FF6384'] // Blue for male, pink for female
        }
      ]
    };

    console.log('Gender Distribution Data:', data); // Log the data for debugging
    res.json(data); // Send the data as a JSON response
  } catch (error) {
    console.error('Failed to fetch gender distribution data:', error);
    res.status(500).json({ error: 'Failed to fetch gender distribution data' }); // Send a server error response
  }
});






// Export the router to use in the main app
module.exports = router;
