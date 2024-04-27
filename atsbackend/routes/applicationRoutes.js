const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const fs = require('fs');
const pdf = require('pdf-parse');

// Set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/') // Ensure this folder exists
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname) // Using original file name
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

    pdf(dataBuffer).then(function(data) {
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
            resumeText: resumeText // Storing extracted text in the database
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

module.exports = router;
