const express = require('express'); // Import Express
const router = express.Router(); // Create a new router object
const Test = require('../models/Test'); // Import Test model
const TestAttempt = require('../models/TestAttempt'); // Import TestAttempt model
const Application = require('../models/Application'); // Import Application model
const JobListing = require('../models/JobListing'); // Import JobListing model
const jwt = require('jsonwebtoken'); // Import JSON Web Token library
const User = require('../models/User'); // Import User model
const Question = require('../models/Question'); // Import Question model











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get test by category
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/category/:category', async (req, res) => {
  const { category } = req.params; // Extract category from URL parameters
  try {
    const test = await Test.findOne({ category }).populate('questions'); // Find a test by category and populate its questions
    if (!test) {
      return res.status(404).json({ message: 'Test not found' }); // If test is not found, send a 404 status code with a message
    }
    res.json(test); // Send the found test as response
  } catch (error) {
    console.error(`Error fetching test for category ${category}:`, error); // Log any errors to the console
    res.status(500).json({ message: 'Server error' }); // Send a 500 status code with an error message
  }
});
















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Submit test answers
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/submit', async (req, res) => {
  const { testId, answers, applicationId } = req.body; // Extract testId, answers, and applicationId from request body
  const authHeader = req.headers.authorization; // Get the authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the authorization header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' }); // If no token, send a 401 status code with a message
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here'); // Verify the token
    const userId = decoded.userId; // Extract userId from the decoded token

    const test = await Test.findById(testId).populate('questions'); // Find the test by ID and populate its questions
    if (!test) {
      return res.status(404).json({ message: 'Test not found' }); // If test is not found, send a 404 status code with a message
    }

    let score = 0; // Initialize score
    const answerDetails = answers.map((answer, index) => {
      const isCorrect = test.questions[index].correctOption === answer; // Check if the answer is correct
      if (isCorrect) score++; // Increment score if the answer is correct
      return {
        question: test.questions[index].question, // Store question text
        givenAnswer: answer, // Store given answer
        correctAnswer: test.questions[index].correctOption, // Store correct answer
        isCorrect // Store if the answer is correct
      };
    });

    // Check if the user already has an attempt for this application
    const existingAttempt = await TestAttempt.findOne({ user: userId, application: applicationId });
    if (existingAttempt) {
      return res.status(400).json({ message: 'Test already attempted' }); // If already attempted, send a 400 status code with a message
    }

    // Create a new test attempt
    const testAttempt = new TestAttempt({
      test: testId, // Store test ID
      user: userId, // Store user ID
      application: applicationId, // Store application ID
      answers: answerDetails, // Store answer details
      score // Store score
    });

    await testAttempt.save(); // Save the new test attempt

    // Update application status to 'Evaluation test completed'
    await Application.findByIdAndUpdate(applicationId, { status: 'Evaluation test completed' });

    res.json({ score }); // Send the score as response
  } catch (error) {
    console.error('Error submitting test:', error); // Log any errors to the console
    res.status(500).json({ message: 'Server error' }); // Send a 500 status code with an error message
  }
});



















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch all test attempts
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/all-attempts', async (req, res) => {
  try {
    const attempts = await TestAttempt.find()
      .populate('test') // Populate test details
      .populate('user') // Populate user details
      .populate({
        path: 'application', // Populate application details
        populate: {
          path: 'jobId', // Populate job listing details within application
          model: 'JobListing'
        }
      });

    console.log('Attempts with jobs:', JSON.stringify(attempts, null, 2)); // Debugging line

    const attemptsWithJobs = attempts.map(attempt => ({
      ...attempt._doc, // Spread attempt document properties
      jobTitle: attempt.application && attempt.application.jobId ? attempt.application.jobId.title : 'N/A', // Add job title
      jobRequirements: attempt.application && attempt.application.jobId ? attempt.application.jobId.requirements : [] // Add job requirements
    }));

    res.json(attemptsWithJobs); // Send attempts with job details as response
  } catch (error) {
    console.error('Error fetching test attempts:', error); // Log any errors to the console
    res.status(500).json({ message: 'Server error' }); // Send a 500 status code with an error message
  }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check if a test attempt exists for a given application
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/check-attempt/:applicationId', async (req, res) => {
  const { applicationId } = req.params; // Extract applicationId from URL parameters
  try {
    const existingAttempt = await TestAttempt.findOne({ application: applicationId }); // Find an existing attempt by application ID
    if (existingAttempt) {
      return res.status(200).json({ attempted: true }); // If attempt exists, send a 200 status code with attempted true
    }
    return res.status(200).json({ attempted: false }); // If no attempt exists, send a 200 status code with attempted false
  } catch (error) {
    console.error('Error checking test attempt:', error); // Log any errors to the console
    res.status(500).json({ message: 'Internal server error' }); // Send a 500 status code with an error message
  }
});













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router; // Export the router
