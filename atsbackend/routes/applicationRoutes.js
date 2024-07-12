const express = require('express'); // Import Express
const router = express.Router(); // Create a new router instance
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path for handling file paths
const Application = require('../models/Application'); // Import the Application model
const JobListing = require('../models/JobListing'); // Import the JobListing model
const fs = require('fs'); // Import fs for file system operations
const pdf = require('pdf-parse'); // Import pdf-parse for extracting text from PDF files
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails
const Interview = require('../models/interview'); // Import the Interview model






// Email credentials
const EMAIL_USER = 'BeeApply.reset@outlook.com';
const EMAIL_PASS = 'beeapply2024';








// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage: storage }); // Initialize multer with the storage engine











// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    logger: true, // Enable logging
    debug: true // Enable debug output
});










// Debugging middleware to check route hits
router.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`); // Log the request URL
    next(); // Proceed to the next middleware/route handler
});

















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to handle job application submission
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { name, email, phone, educationLevel, experienceLevel, university, motivationLetter, jobId } = req.body; // Extract form data from the request body
    const file = req.file; // Extract the uploaded file

    if (!file) {
        return res.status(400).send('No resume file uploaded.'); // Check if the file was uploaded
    }

    // Read the PDF file and extract text
    let dataBuffer = fs.readFileSync(file.path); // Read the file into a buffer

    pdf(dataBuffer).then(function (data) {
        // data.text is the extracted text from the PDF
        const resumeText = data.text; // Store the extracted text

        // Create an application object with the extracted and form data
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
            resumeText: resumeText, // Store extracted text in the database
            status: 'in review' // Initial status
        };

        const application = new Application(applicationData); // Create a new Application instance

        application.save()
            .then(() => res.json({ message: 'Application and file saved successfully', data: application })) // Save the application to the database and send a response
            .catch(error => {
                console.error('Error saving the application:', error); // Log any errors
                res.status(500).send('Error processing application'); // Send an error response
            });
    }).catch(error => {
        console.error('Error reading the PDF file:', error); // Log any errors
        res.status(500).send('Error extracting text from resume'); // Send an error response
    });
});























/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to GET all applications for the current user by email
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {
    try {
        const email = req.query.email; // Extract email from query parameters
        const applications = await Application.find({ email }).populate('jobId'); // Find applications by email and populate job details
        res.json(applications); // Send applications as a JSON response
    } catch (error) {
        console.error('Failed to fetch applications:', error); // Log any errors
        res.status(500).send('Error fetching applications'); // Send an error response
    }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to GET applications for a specific job
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/for-job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params; // Extract jobId from route parameters
        const applications = await Application.find({ jobId }).populate('jobId'); // Find applications by jobId and populate job details
        res.json(applications); // Send applications as a JSON response
    } catch (error) {
        console.error('Failed to fetch applications for the job:', error); // Log any errors
        res.status(500).send('Error fetching applications for the job'); // Send an error response
    }
});


















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to GET all applications (for admin or HR manager)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/all', async (req, res) => {
    try {
        const applications = await Application.find().populate('jobId'); // Find all applications and populate job details
        res.json(applications); // Send applications as a JSON response
    } catch (error) {
        console.error('Failed to fetch all applications:', error); // Log any errors
        res.status(500).send('Error fetching all applications'); // Send an error response
    }
});


















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to GET application details by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId'); // Find application by ID and populate job details
        if (!application) {
            return res.status(404).json({ message: 'Application not found' }); // Check if the application exists
        }
        res.json(application); // Send application details as a JSON response
    } catch (error) {
        console.error('Failed to fetch application details:', error); // Log any errors
        res.status(500).send('Error fetching application details'); // Send an error response
    }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to accept an application
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/accept/:id', async (req, res) => {
    try {
        const applicationId = req.params.id; // Extract application ID from route parameters
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'Accepted' }, { new: true }); // Update the application status to 'Accepted'

        if (!application) {
            return res.status(404).json({ message: 'Application not found' }); // Check if the application exists
        }

        // Define email options
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

        await transporter.sendMail(mailOptions); // Send the email

        res.json(application); // Send the updated application as a JSON response
    } catch (error) {
        console.error('Failed to accept application:', error); // Log any errors
        res.status(500).send('Error accepting application'); // Send an error response
    }
});
























/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to decline an application
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/decline/:id', async (req, res) => {
    try {
        const applicationId = req.params.id; // Extract application ID from route parameters
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'Declined' }, { new: true }); // Update the application status to 'Declined'
        res.json(application); // Send the updated application as a JSON response
    } catch (error) {
        console.error('Failed to decline application:', error); // Log any errors
        res.status(500).send('Error declining application'); // Send an error response
    }
});

























/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to decline an application after evaluation test
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/decline-after-test/:id', async (req, res) => {
    try {
        const applicationId = req.params.id; // Extract application ID from route parameters
        const application = await Application.findByIdAndUpdate(applicationId, { status: 'declined after evaluation test' }, { new: true }); // Update the application status to 'declined after evaluation test'

        if (!application) {
            return res.status(404).json({ message: 'Application not found' }); // Check if the application exists
        }

        // Define email options
        const mailOptions = {
            from: EMAIL_USER,
            to: application.email,
            subject: 'Application Declined',
            text: `Dear ${application.name},\n\nWe regret to inform you that your application for the ${application.jobId.title} position has been declined after the evaluation test.\n\nThank you for your interest in our company.\n\nBest regards,\n[Your Company Name]`
        };

        await transporter.sendMail(mailOptions); // Send the email

        res.json(application); // Send the updated application as a JSON response
    } catch (error) {
        console.error('Failed to decline application:', error); // Log any errors
        res.status(500).send('Error declining application'); // Send an error response
    }
});























/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to accept an application after evaluation test
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/accept-after-test/:id', async (req, res) => {
    try {
        const applicationId = req.params.id; // Extract application ID from route parameters
        const { date, time } = req.body; // Extract date and time from request body
        const application = await Application.findById(applicationId); // Find the application by ID

        if (!application) {
            return res.status(404).json({ message: 'Application not found' }); // Check if the application exists
        }

        if (!date || !time) {
            return res.status(400).json({ message: 'Date and time are required for the interview.' }); // Validate date and time
        }

        const interview = new Interview({
            applicationId: applicationId,
            applicantName: application.name,
            dateTime: new Date(`${date}T${time}`), // Combine date and time into a Date object
        });

        await interview.save(); // Save the interview details

        application.status = 'accepted for interview'; // Update the application status
        await application.save(); // Save the updated application

        // Define email options
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

        await transporter.sendMail(mailOptions); // Send the email

        res.json(application); // Send the updated application as a JSON response
    } catch (error) {
        console.error('Failed to accept application:', error); // Log any errors
        res.status(500).send('Error accepting application'); // Send an error response
    }
});


























/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Endpoint to update application status
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/:id/status', async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id, // Extract application ID from route parameters
            { status: req.body.status }, // Update the application status with the value from request body
            { new: true } // Return the updated application
        );
        res.json(application); // Send the updated application as a JSON response
    } catch (error) {
        res.status(500).send('Error updating status: ' + error.message); // Send an error response with the error message
    }
});

module.exports = router; // Export the router
