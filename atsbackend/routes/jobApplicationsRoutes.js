const express = require('express');
const router = express.Router();
const multer = require('multer');
const JobApplication = require('../models/JobApplication'); // Make sure to create a new model in the next steps
console.log('Imported JobApplication model:', JobApplication);
const pdfParse = require('pdf-parse');

// Setup multer for file uploads (if needed for resume upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Add routes here in subsequent steps

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { jobID, applicantID, fullName, email, phoneNumber, educationLevel, experience, university, motivationLetter } = req.body;
    const resumeFile = req.file;
    
    try {
        let resumeText = '';
        if (resumeFile) {
            const pdfData = await pdfParse(resumeFile.buffer);
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








module.exports = router;
