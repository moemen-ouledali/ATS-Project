const express = require('express'); // Import the Express module
const router = express.Router(); // Create a new router object from Express
const Application = require('../models/Application'); // Import the Application model
const JobListing = require('../models/JobListing'); // Import the JobListing model
const TestAttempt = require('../models/TestAttempt'); // Import the TestAttempt model
const User = require('../models/User'); // Import the User model (Ensure the path to the User model is correct)







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get application status distribution
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/application-status', async (req, res) => {
  try {
    const applications = await Application.find({}); // Fetch all application records from the database
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1; // Count the number of applications for each status
      return acc;
    }, {});

    const data = {
      labels: Object.keys(statusCounts), // Create an array of status labels
      datasets: [{
        data: Object.values(statusCounts), // Create an array of counts for each status
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Define background colors for the chart
      }]
    };

    console.log('Application Status Data:', data); // Log the status data to the console
    res.json(data); // Send the status data as a JSON response
  } catch (error) {
    console.error('Failed to fetch application status data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applications over time
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/applications-over-time', async (req, res) => {
  try {
    const applications = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // Group by year
            month: { $month: "$createdAt" }, // Group by month
            day: { $dayOfMonth: "$createdAt" } // Group by day
          },
          count: { $sum: 1 } // Count the number of applications per day
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1 // Sort the results by year, month, and day
        }
      }
    ]);

    const data = {
      labels: applications.map(app => `${app._id.year}-${app._id.month}-${app._id.day}`), // Create date labels
      datasets: [{
        data: applications.map(app => app.count), // Create an array of counts for each date
        backgroundColor: '#4A90E2', // Define the background color for the chart
        borderColor: '#357ABD', // Define the border color for the chart
        fill: false // Do not fill the area under the line
      }]
    };

    console.log('Applications Over Time Data:', data); // Log the applications over time data to the console
    res.json(data); // Send the applications over time data as a JSON response
  } catch (error) {
    console.error('Failed to fetch applications over time data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by education level
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/education-level', async (req, res) => {
  try {
    const applications = await Application.find({}); // Fetch all application records from the database
    const educationCounts = applications.reduce((acc, app) => {
      acc[app.educationLevel] = (acc[app.educationLevel] || 0) + 1; // Count the number of applications for each education level
      return acc;
    }, {});

    const data = {
      labels: Object.keys(educationCounts), // Create an array of education level labels
      datasets: [{
        data: Object.values(educationCounts), // Create an array of counts for each education level
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Define background colors for the chart
      }]
    };

    console.log('Education Level Data:', data); // Log the education level data to the console
    res.json(data); // Send the education level data as a JSON response
  } catch (error) {
    console.error('Failed to fetch education level data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by experience level
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/experience-level', async (req, res) => {
  try {
    const applications = await Application.find({}); // Fetch all application records from the database
    const experienceCounts = applications.reduce((acc, app) => {
      acc[app.experienceLevel] = (acc[app.experienceLevel] || 0) + 1; // Count the number of applications for each experience level
      return acc;
    }, {});

    const data = {
      labels: Object.keys(experienceCounts), // Create an array of experience level labels
      datasets: [{
        data: Object.values(experienceCounts), // Create an array of counts for each experience level
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Define background colors for the chart
      }]
    };

    console.log('Experience Level Data:', data); // Log the experience level data to the console
    res.json(data); // Send the experience level data as a JSON response
  } catch (error) {
    console.error('Failed to fetch experience level data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applications per job category
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/applications-per-category', async (req, res) => {
  try {
    const jobListings = await JobListing.find({}); // Fetch all job listings from the database
    const categoryCounts = jobListings.reduce((acc, job) => {
      acc[job.category] = (acc[job.category] || 0) + 1; // Count the number of applications for each job category
      return acc;
    }, {});

    const data = {
      labels: Object.keys(categoryCounts), // Create an array of job category labels
      datasets: [{
        data: Object.values(categoryCounts), // Create an array of counts for each job category
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Define background colors for the chart
      }]
    };

    console.log('Applications Per Category Data:', data); // Log the applications per category data to the console
    res.json(data); // Send the applications per category data as a JSON response
  } catch (error) {
    console.error('Failed to fetch applications per category data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});
















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get test scores distribution
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/test-scores', async (req, res) => {
  try {
    const testAttempts = await TestAttempt.find({}); // Fetch all test attempt records from the database
    const scores = testAttempts.map(attempt => attempt.score); // Extract scores from each test attempt

    const data = {
      labels: scores, // Use scores as labels
      datasets: [{
        data: scores, // Use scores as data points
        backgroundColor: '#4A90E2' // Define background color for the chart
      }]
    };

    console.log('Test Scores Data:', data); // Log the test scores data to the console
    res.json(data); // Send the test scores data as a JSON response
  } catch (error) {
    console.error('Failed to fetch test scores data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by university
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/top-universities', async (req, res) => {
  try {
    const applications = await Application.find({}); // Fetch all application records from the database
    const universityCounts = applications.reduce((acc, app) => {
      if (app.university) {
        acc[app.university] = (acc[app.university] || 0) + 1; // Count the number of applications for each university
      }
      return acc;
    }, {});

    const data = {
      labels: Object.keys(universityCounts), // Create an array of university labels
      datasets: [{
        data: Object.values(universityCounts), // Create an array of counts for each university
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56'] // Define background colors for the chart
      }]
    };

    console.log('Top Universities Data:', data); // Log the university data to the console
    res.json(data); // Send the university data as a JSON response
  } catch (error) {
    console.error('Failed to fetch university data:', error); // Log an error message if data fetch fails
    res.status(500).send('Server Error'); // Send a server error response
  }
});













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get applicants by city
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/applicants-by-city', async (req, res) => {
  try {
    const applicantsByCity = await Application.aggregate([
      {
        $lookup: {
          from: 'users', // Join with the 'users' collection
          localField: 'email', // Use the email field from the Application schema
          foreignField: 'email', // Match it with the email field from the User schema
          as: 'userDetails' // Store the joined data in 'userDetails'
        }
      },
      { $unwind: '$userDetails' }, // Deconstruct the 'userDetails' array
      {
        $group: {
          _id: '$userDetails.city', // Group by city
          count: { $sum: 1 } // Count the number of applications per city
        }
      },
      {
        $project: {
          city: '$_id', // Project the city field
          count: 1, // Project the count field
          _id: 0 // Do not include the _id field in the result
        }
      }
    ]);

    const labels = applicantsByCity.map(item => item.city || 'Unknown'); // Create city labels, default to 'Unknown' if city is null
    const data = applicantsByCity.map(item => item.count); // Create an array of counts for each city

    res.json({
      labels,
      datasets: [
        {
          label: 'Applicants by City', // Label for the chart
          data, // Use the data array for the chart
          backgroundColor: '#36A2EB' // Define background color for the chart
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching applicants by city:', error); // Log an error message if data fetch fails
    res.status(500).json({ error: 'Error fetching applicants by city' }); // Send a server error response
  }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to get gender distribution
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/gender', async (req, res) => {
  try {
    const maleCount = await User.countDocuments({ gender: 'male' }); // Count the number of male users
    const femaleCount = await User.countDocuments({ gender: 'female' }); // Count the number of female users

    const data = {
      labels: ['Male', 'Female'], // Gender labels
      datasets: [
        {
          data: [maleCount, femaleCount], // Gender counts
          backgroundColor: ['#36A2EB', '#FF6384'] // Define background colors for the chart
        }
      ]
    };

    console.log('Gender Distribution Data:', data); // Log the gender distribution data to the console
    res.json(data); // Send the gender distribution data as a JSON response
  } catch (error) {
    console.error('Failed to fetch gender distribution data:', error); // Log an error message if data fetch fails
    res.status(500).json({ error: 'Failed to fetch gender distribution data' }); // Send a server error response
  }
});

module.exports = router; // Export the router object
