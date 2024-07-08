// Import necessary modules
const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const Question = require('../models/Question'); // Ensure this is imported












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to get a test by category
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        // Find the test by category and populate its questions
        const test = await Test.findOne({ category }).populate('questions');
        if (!test) {
            // If no test is found, respond with a 404 status (Not Found)
            return res.status(404).json({ message: 'Test not found' });
        }
        // Respond with the found test
        res.json(test);
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error(`Error fetching test for category ${category}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to submit test answers
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/submit', async (req, res) => {
    const { testId, answers, applicationId } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token is provided, respond with a 401 status (Unauthorized)
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
        const userId = decoded.userId;

        // Find the test by ID and populate its questions
        const test = await Test.findById(testId).populate('questions');
        if (!test) {
            // If no test is found, respond with a 404 status (Not Found)
            return res.status(404).json({ message: 'Test not found' });
        }

        // Initialize score and process each answer
        let score = 0;
        const answerDetails = answers.map((answer, index) => {
            const isCorrect = test.questions[index].correctOption === answer;
            if (isCorrect) score++;
            return {
                question: test.questions[index].question,
                givenAnswer: answer,
                correctAnswer: test.questions[index].correctOption,
                isCorrect
            };
        });

        // Check if the user already has an attempt for this application
        const existingAttempt = await TestAttempt.findOne({ user: userId, application: applicationId });
        if (existingAttempt) {
            // If an attempt already exists, respond with a 400 status (Bad Request)
            return res.status(400).json({ message: 'Test already attempted' });
        }

        // Create a new test attempt
        const testAttempt = new TestAttempt({
            test: testId,
            user: userId,
            application: applicationId,
            answers: answerDetails,
            score,
        });

        // Save the test attempt
        await testAttempt.save();

        // Update the application status to 'Evaluation test completed'
        await Application.findByIdAndUpdate(applicationId, { status: 'Evaluation test completed' });

        // Respond with the score
        res.json({ score });
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Server error' });
    }
});





















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to fetch all test attempts
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/all-attempts', async (req, res) => {
    try {
        // Find all test attempts and populate related fields
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

        // Debugging line to log attempts with job details
        console.log('Attempts with jobs:', JSON.stringify(attempts, null, 2));

        // Map attempts to include job titles and requirements
        const attemptsWithJobs = attempts.map(attempt => ({
            ...attempt._doc,
            jobTitle: attempt.application && attempt.application.jobId ? attempt.application.jobId.title : 'N/A',
            jobRequirements: attempt.application && attempt.application.jobId ? attempt.application.jobId.requirements : []
        }));

        // Respond with the mapped attempts
        res.json(attemptsWithJobs);
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Error fetching test attempts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});





















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to check if an application has an existing test attempt
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/check-attempt/:applicationId', async (req, res) => {
    const { applicationId } = req.params;
    try {
        // Find an existing test attempt for the given application ID
        const existingAttempt = await TestAttempt.findOne({ application: applicationId });
        if (existingAttempt) {
            // If an attempt exists, respond with a flag indicating true
            return res.status(200).json({ attempted: true });
        }
        // If no attempt is found, respond with a flag indicating false
        return res.status(200).json({ attempted: false });
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Error checking test attempt:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});












// Export the router so it can be used in the main application
module.exports = router;
