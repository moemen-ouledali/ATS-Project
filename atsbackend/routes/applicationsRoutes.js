// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Application = require('../models/Application'); // Ensure this path matches your model

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Use an absolute path
        const uploadPath = path.join(__dirname, '../uploads');
        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        // Ensure the filename is safe to use and prepend the timestamp
        const safeName = file.originalname.replace(/ /g,'_');
        cb(null, new Date().toISOString().replace(/:/g, '-') + safeName);
    }
});

// Filter for PDF files only
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Initialize multer with settings
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Router from express
const router = express.Router();

// POST route for job applications
router.post('/apply', upload.single('resume'), async (req, res) => {
    console.log(req.body);  // Log all received form data
    console.log(req.file);  // Log file data
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('Uploaded file:', req.file.path);

    try {
        const { name, email, phone, educationLevel, experienceLevel, university, motivationLetter, jobId } = req.body;
        const resumePath = req.file.path;  // Path to the uploaded PDF file

        // Proceed with PDF text extraction and application saving
        let dataBuffer = fs.readFileSync(resumePath);
        pdfParse(dataBuffer).then(async function(data) {
            const resumeText = data.text;
            const application = new Application({
                name,
                email,
                phone,
                educationLevel,
                experienceLevel,
                university,
                motivationLetter,
                jobId,
                resumePath,
                resumeText
            });
            await application.save();
            res.status(201).send('Application submitted successfully.');
        });
    } catch (error) {
        console.error('Failed to process application:', error);
        res.status(500).send('Failed to process application: ' + error.message);
    }
});

// Export the router
module.exports = router;
