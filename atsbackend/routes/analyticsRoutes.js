const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const JobListing = require('../models/JobListing');
const TestAttempt = require('../models/TestAttempt');

// Endpoint to get application status distribution
router.get('/application-status', async (req, res) => {
  try {
    const applications = await Application.find({});
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch application status data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get applications over time
router.get('/applications-over-time', async (req, res) => {
  try {
    const applications = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    const data = {
      labels: applications.map(app => `${app._id.year}-${app._id.month}-${app._id.day}`),
      datasets: [{
        data: applications.map(app => app.count),
        backgroundColor: '#4A90E2',
        borderColor: '#357ABD',
        fill: false
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch applications over time data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get applicants by education level
router.get('/education-level', async (req, res) => {
  try {
    const applications = await Application.find({});
    const educationCounts = applications.reduce((acc, app) => {
      acc[app.educationLevel] = (acc[app.educationLevel] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(educationCounts),
      datasets: [{
        data: Object.values(educationCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56']
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch education level data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get applicants by experience level
router.get('/experience-level', async (req, res) => {
  try {
    const applications = await Application.find({});
    const experienceCounts = applications.reduce((acc, app) => {
      acc[app.experienceLevel] = (acc[app.experienceLevel] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(experienceCounts),
      datasets: [{
        data: Object.values(experienceCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56']
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch experience level data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get applications per job category
router.get('/applications-per-category', async (req, res) => {
  try {
    const jobListings = await JobListing.find({});
    const categoryCounts = jobListings.reduce((acc, job) => {
      acc[job.category] = (acc[job.category] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56']
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch applications per category data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get test scores distribution
router.get('/test-scores', async (req, res) => {
  try {
    const testAttempts = await TestAttempt.find({});
    const scores = testAttempts.map(attempt => attempt.score);

    const data = {
      labels: scores,
      datasets: [{
        data: scores,
        backgroundColor: '#4A90E2'
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch test scores data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get applicants by university
router.get('/top-universities', async (req, res) => {
  try {
    const applications = await Application.find({});
    const universityCounts = applications.reduce((acc, app) => {
      if (app.university) {
        acc[app.university] = (acc[app.university] || 0) + 1;
      }
      return acc;
    }, {});

    const data = {
      labels: Object.keys(universityCounts),
      datasets: [{
        data: Object.values(universityCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56']
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch university data:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get applicants by city
router.get('/applicants-by-city', async (req, res) => {
  try {
    const applications = await Application.find({});
    const cityCounts = applications.reduce((acc, app) => {
      acc[app.city] = (acc[app.city] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(cityCounts),
      datasets: [{
        data: Object.values(cityCounts),
        backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56']
      }]
    };

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch city data:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
