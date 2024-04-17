const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User'); // Ensure User model is imported if needed for population


// Setup multer for in-memory buffer storage for immediate PDF text extraction
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { jobID, applicantID, fullName, email, phoneNumber, educationLevel, experience, university, motivationLetter } = req.body;
    const resumeFile = req.file;
    console.log('Received application data:', req.body);  // Debug incoming form data

    try {
        let resumeText = '';
        if (resumeFile) {
            const pdfData = await pdfParse(resumeFile.buffer); // Directly use buffer for PDF text extraction
            resumeText = pdfData.text;
        }

        const newJobApplication = new JobApplication({
            jobID,
            applicantID,
            status: 'in review',
            fullName,
            email,
            phoneNumber,
            educationLevel,
            experience,
            university,
            motivationLetter,
            resumeText
        });

        await newJobApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', applicationId: newJobApplication._id });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({ message: 'Failed to submit application', error: error.message });
    }
});

// Fetch all applications for a specific job
router.get('/for-job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await JobApplication.find({ jobID: jobId }).populate('applicantID', 'fullName email phoneNumber');
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

// Accept an application
router.put('/accept/:id', async (req, res) => {
    try {
        const updatedApplication = await JobApplication.findByIdAndUpdate(
            req.params.id,
            { status: 'pre-accepted' },
            { new: true }
        );
        res.json({ message: 'Application pre-accepted', updatedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept application', error: error.message });
    }
});

// Decline an application
router.put('/decline/:id', async (req, res) => {
    try {
        const updatedApplication = await JobApplication.findByIdAndUpdate(
            req.params.id,
            { status: 'declined' },
            { new: true }
        );
        res.json({ message: 'Application declined', updatedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Failed to decline application', error: error.message });
    }
});

// Fetch all applications for a candidate
router.get('/candidate/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await JobApplication.find({ applicantID: userId }).populate('jobID', 'title');
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications for candidate:', error);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

// Fetch all applications with job and user details
router.get('/all-details', async (req, res) => {
    try {
        const applications = await JobApplication.find({})
            .populate('jobID', 'title company')
            .populate('applicantID', 'fullName email phoneNumber');
        res.json(applications);
    } catch (error) {
        console.error('Error fetching all applications with details:', error);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

module.exports = router;
