const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/apply', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir; // Temporary directory to store files
    form.keepExtensions = true; // Include the extensions of the files
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error handling form submission:', err);
            return res.status(500).send('Server error while processing upload');
        }

        console.log('Fields:', fields);
        console.log('Received files:', files);

        // Ensure the 'resume' field is accessed correctly
        const resumeFile = files.resume;

        if (!resumeFile) {
            return res.status(400).send('No resume file uploaded.');
        }

        const filePath = resumeFile.filepath;

        try {
            // Read the file as binary data
            const fileContent = fs.readFileSync(filePath);

            // Create a new application object
            const applicationData = {
                ...fields,
                resumePath: filePath,
                resumeText: fileContent.toString('utf8') // Convert Buffer to string if needed
            };

            const application = new Application(applicationData);
            await application.save();

            res.json({ message: 'Application and file saved successfully', data: application });
        } catch (fileReadError) {
            console.error('Error reading the file:', fileReadError);
            return res.status(500).send('Error reading the resume file');
        }
    });
});

module.exports = router;
