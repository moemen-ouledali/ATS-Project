// atsbackend/routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing');
const fs = require('fs');
const pdf = require('pdf-parse');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Middleware to authenticate token
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Authentication failed' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Using original file name
    }
});

const upload = multer({ storage: storage });

router.post('/apply', requireAuth, upload.single('resume'), async (req, res) => {
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
router.get('/', requireAuth, async (req, res) => {
    try {
        const email = req.user.email;
        console.log(`Fetching applications for user with email: ${email}`);
        const applications = await Application.find({ email: email }).populate('jobId');
        console.log(`Applications found: ${applications.length}`);
        res.json(applications);
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        res.status(500).send('Error fetching applications');
    }
});

// GET a single application by ID
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        console.error('Failed to fetch application:', error);
        res.status(500).send('Error fetching application');
    }
});

module.exports = router;
