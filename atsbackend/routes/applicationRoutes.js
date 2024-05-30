const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing'); // Ensure this is imported
const fs = require('fs');
const pdf = require('pdf-parse');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Using original file name
    }
});

const upload = multer({ storage: storage });

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Debugging middleware to check route hits
router.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`);
    next();
});

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { name, email, phone, educationLevel, experienceLevel, university, motivationLetter, jobId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('No resume file uploaded.');
    }

    // Read the PDF file and extract text
    let dataBuffer = fs.readFileSync(file.path);

    pdf(dataBuffer).then(function (data) {
        // `data.text` is the extracted text from the PDF
        const resumeText = data.text;

        const applicationData = {
            name,
            email,
            phone,
            educationLevel,
            experienceLevel,
            university,
            motivationLetter,
            jobId,
            resumePath: file.path,
            resumeText: resumeText, // Storing extracted text in the database
            status: 'in review'
        };

        const application = new Application(applicationData);

        application.save()
            .then(() => res.json({ message: 'Application and file saved successfully', data: application }))
            .catch(error => {
                console.error('Error saving the application:', error);
                res.status(500).send('Error processing application');
            });
    }).catch(error => {
        console.error('Error reading the PDF file:', error);
        res.status(500).send('Error extracting text from resume');
    });
});

// GET all applications for the current user by email
router.get('/', async (req, res) => {
    try {
        const email = req.query.email;
        const applications = await Application.find({ email }).populate('jobId');
        res.json(applications);
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        res.status(500).send('Error fetching applications');
    }
});

// GET applications for a specific job
router.get('/for-job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId }).populate('jobId');
        res.json(applications);
    } catch (error) {
        console.error('Failed to fetch applications for the job:', error);
        res.status(500).send('Error fetching applications for the job');
    }
});

// GET all applications (for admin or HR manager)
router.get('/all', async (req, res) => {
    try {
        const applications = await Application.find().populate('jobId');
        res.json(applications);
    } catch (error) {
        console.error('Failed to fetch all applications:', error);
        res.status(500).send('Error fetching all applications');
    }
});

// GET application details by ID
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Failed to fetch application details:', error);
        res.status(500).send('Error fetching application details');
    }
});

// Accept an application
router.put('/accept/:id', async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'Accepted' }, { new: true });
        res.json(application);
    } catch (error) {
        console.error('Failed to accept application:', error);
        res.status(500).send('Error accepting application');
    }
});

// Decline an application
router.put('/decline/:id', async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'Declined' }, { new: true });
        res.json(application);
    } catch (error) {
        console.error('Failed to decline application:', error);
        res.status(500).send('Error declining application');
    }
});

// New endpoints for post-evaluation test decisions

// Decline an application after evaluation test
router.put('/decline-after-test/:id', async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'declined after evaluation test' }, { new: true });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: 'Application Declined',
            text: `Dear ${application.name},\n\nWe regret to inform you that your application for the ${application.jobId.title} position has been declined after the evaluation test.\n\nThank you for your interest in our company.\n\nBest regards,\n[Your Company Name]`
        };

        await transporter.sendMail(mailOptions);

        res.json(application);
    } catch (error) {
        console.error('Failed to decline application:', error);
        res.status(500).send('Error declining application');
    }
});

// Accept an application after evaluation test
router.put('/accept-after-test/:id', async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { date, time } = req.body;
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'accepted for interview' }, { new: true });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: 'Application Accepted - Interview Scheduled',
            text: `Dear ${application.name},\n\nWe are pleased to inform you that your application for the ${application.jobId.title} position has been accepted. Your interview has been scheduled for ${date} at ${time}.\n\nThank you for your interest in our company.\n\nBest regards,\n[Your Company Name]`
        };

        await transporter.sendMail(mailOptions);

        res.json(application);
    } catch (error) {
        console.error('Failed to accept application:', error);
        res.status(500).send('Error accepting application');
    }
});

module.exports = router;
