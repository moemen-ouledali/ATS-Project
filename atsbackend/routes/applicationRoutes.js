const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const JobListing = require('../models/JobListing'); // Ensure this is imported
const fs = require('fs');
const pdf = require('pdf-parse');
const nodemailer = require('nodemailer');
const Interview = require('../models/interview'); // Import the Interview model

// Email credentials
const EMAIL_USER = 'BeeApply.reset@outlook.com';
const EMAIL_PASS = 'beeapply2024';

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
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    logger: true, // Enable logger
    debug: true // Enable debug output
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
        // data.text is the extracted text from the PDF
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

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const mailOptions = {
            from: EMAIL_USER,
            to: application.email,
            subject: 'Pre-Acceptance Notification',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <div style="background-color: #4A90E2; padding: 20px; color: #fff; text-align: center;">
                        <h1 style="margin: 0;">BeeApply Pre-Acceptance</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear <strong>${application.name}</strong>,</p>
                        <p>We are pleased to inform you that you are <strong>pre-accepted</strong> for the next step in our recruitment process. Please log in to your candidate dashboard on <strong>BeeApply</strong> to take the evaluation test.</p>
                        <p>If you have any questions, feel free to reach out to us.</p>
                        <p>Best regards,</p>
                        <p>BeeApply Team</p>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #aaa;">
                        &copy; 2024 ATS. All rights reserved.
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

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
            from: EMAIL_USER,
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
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!date || !time) {
            return res.status(400).json({ message: 'Date and time are required for the interview.' });
        }

        const interview = new Interview({
            applicationId: applicationId,
            applicantName: application.name,
            dateTime: new Date(`${date}T${time}`),
        });

        await interview.save();

        application.status = 'accepted for interview';
        await application.save();

        const mailOptions = {
            from: EMAIL_USER,
            to: application.email,
            subject: 'Application Accepted - Interview Scheduled',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <p>Dear ${application.name},</p>
                    <p>We are pleased to inform you that your application for the <strong>${application.jobId.title}</strong> position has been accepted. We have scheduled your interview for <strong>${date}</strong> at <strong>${time}</strong>.</p>
                    <p>We are excited about the possibility of you joining our team and are looking forward to discussing how you can contribute to our company. Please let us know if you need any additional information or have any questions prior to the interview.</p>
                    <p>Thank you for your interest in our company.</p>
                    <p>Best regards,</p>
                    <p>[Your Company Name]</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json(application);
    } catch (error) {
        console.error('Failed to accept application:', error);
        res.status(500).send('Error accepting application');
    }
});

// Update application status
router.put('/:id/status', async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(application);
    } catch (error) {
        res.status(500).send('Error updating status: ' + error.message);
    }
});

module.exports = router;
