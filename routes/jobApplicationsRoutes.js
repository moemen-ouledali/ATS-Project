const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files
const JobApplication = require('../models/JobApplication');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises; // Use the promise-based version of fs for async operations

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { name, age, degree, motivationLetter, jobId, applicantId } = req.body;
    const resumeFile = req.file;

    try {
        let resumeText = '';
        if (resumeFile) {
            const buffer = await fs.readFile(resumeFile.path);
            const pdfData = await pdfParse(buffer);
            resumeText = pdfData.text;
            await fs.unlink(resumeFile.path); // Delete the PDF after extracting text
        }

        const newJobApplication = new JobApplication({
            name,
            age,
            degree,
            motivationLetter,
            resumeText,
            jobId: req.body.jobId,
            applicantId: req.body.applicantId
        });

        await newJobApplication.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error processing application:', error);
        if (resumeFile) {
            try {
                await fs.unlink(resumeFile.path);
            } catch (fsError) {
                console.error('Error deleting file:', fsError.message);
            }
        }
        res.status(500).json({ message: 'Failed to submit application', error: error.message });
    }
});

// Fetch all applications for a specific job
router.get('/for-job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        // Populate additional fields from the User model as required
        const applications = await JobApplication.find({ jobId: jobId }).populate('applicantId', 'email username');
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

router.put('/accept/:id', async (req, res) => {
    try {
      const updatedApplication = await JobApplication.findByIdAndUpdate(
        req.params.id,
        { status: 'accepted' },
        { new: true }
      );
      res.json({ message: 'Application accepted', updatedApplication });
    } catch (error) {
      res.status(500).json({ message: 'Failed to accept application', error: error.message });
    }
});

// PUT /api/jobapplications/decline/:id - Decline an application
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



router.get('/candidate/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const applications = await JobApplication.find({ applicantId: userId }).populate('jobId', 'title');
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications for candidate:', error);
      res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });


module.exports = router;

