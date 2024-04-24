const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        // Append the timestamp to the filename to ensure uniqueness
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ dest: 'uploads/' });


// POST - Create a new application
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No resume file was uploaded.');
        }

        const resumePath = req.file.path;

        // Read PDF file
        let pdfData = fs.readFileSync(resumePath);
        pdfParse(pdfData).then(async (pdfContent) => {
            const applicationData = {
                ...req.body,
                resumePath,
                resumeText: pdfContent.text
            };
            const application = new Application(applicationData);
            await application.save();
            res.status(201).json(application);
        });
        
    } catch (error) {
        console.error('Failed to create application:', error);
        res.status(500).json({ message: 'Failed to create application', error: error });
    }
});

module.exports = router;
