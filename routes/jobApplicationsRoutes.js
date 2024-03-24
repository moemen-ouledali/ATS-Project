const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const JobApplication = require('../models/JobApplication');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the date to make the filename unique
  },
});
const upload = multer({ storage: storage });

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { name, age, degree, motivationLetter, jobId } = req.body;
    const applicantId = req.user._id; // Assuming you're extracting the user from a middleware
    const resumeFile = req.file;

    try {
        let resumeText = '';
        if (resumeFile) {
            const buffer = fs.readFileSync(resumeFile.path);
            const pdfData = await pdfParse(buffer);
            resumeText = pdfData.text;
            fs.unlinkSync(resumeFile.path); // Optionally remove the file after processing
        }

        const newJobApplication = new JobApplication({
            name,
            age: Number(age),
            degree,
            motivationLetter,
            resumeText,
            jobId: mongoose.Types.ObjectId(jobId),
            applicantId: mongoose.Types.ObjectId(applicantId),
        });

        await newJobApplication.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({ message: 'Failed to submit application', error: error.message });
        if (resumeFile) {
            fs.unlinkSync(resumeFile.path); // Ensure the file is removed if an error occurs
        }
    }
});

module.exports = router;
