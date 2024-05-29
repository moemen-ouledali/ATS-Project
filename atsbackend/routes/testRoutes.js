const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

// Get test by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const test = await Test.findOne({ category }).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error(`Error fetching test for category ${category}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit test answers
router.post('/submit', async (req, res) => {
  const { testId, answers, applicationId } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    const userId = decoded.userId;

    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let score = 0;
    test.questions.forEach((question, index) => {
      if (question.correctOption === answers[index]) {
        score++;
      }
    });

    // Check if the user already has an attempt for this application
    const existingAttempt = await TestAttempt.findOne({ user: userId, application: applicationId });
    if (existingAttempt) {
      return res.status(400).json({ message: 'Test already attempted' });
    }

    // Create a new test attempt
    const testAttempt = new TestAttempt({
      test: testId,
      user: userId,
      application: applicationId,
      answers,
      score,
    });

    await testAttempt.save();

    // Update application status to 'Evaluation test completed'
    await Application.findByIdAndUpdate(applicationId, { status: 'Evaluation test completed' });

    res.json({ score });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all test attempts
router.get('/all-attempts', async (req, res) => {
  try {
    const attempts = await TestAttempt.find()
      .populate('test')
      .populate('user')
      .populate({
        path: 'application',
        populate: {
          path: 'jobId',
          model: 'JobListing'
        }
      });

    console.log('Attempts with jobs:', JSON.stringify(attempts, null, 2)); // Debugging line

    const attemptsWithJobs = attempts.map(attempt => ({
      ...attempt._doc,
      jobTitle: attempt.application.jobId ? attempt.application.jobId.title : 'N/A',
      jobRequirements: attempt.application.jobId ? attempt.application.jobId.requirements : []
    }));

    res.json(attemptsWithJobs);
  } catch (error) {
    console.error('Error fetching test attempts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
