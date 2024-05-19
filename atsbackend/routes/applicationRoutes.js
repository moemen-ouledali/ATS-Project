const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing'); // Ensure this is imported
const fs = require('fs');
const pdf = require('pdf-parse');

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

module.exports = router;
