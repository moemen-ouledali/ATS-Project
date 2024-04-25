const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Application = require('../models/Application'); // Ensure this path matches your model
const pdfParse = require('pdf-parse');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Multer middleware
const upload = multer({ storage: storage });

// POST route for job applications
router.post('/apply', upload.single('resume'), (req, res, next) => {
  const busboy = req.busboy;

  // Parse form data
  busboy.on('field', (fieldname, data) => {
    if (fieldname === 'name') {
      req.body.name = data;
    } else if (fieldname === 'email') {
      req.body.email = data;
    } else if (fieldname === 'jobId') {
      req.body.jobId = data;
    }
  });

  // Parse PDF file
  busboy.on('file', (fieldname, file, filename) => {
    const filePath = path.join(__dirname, '../uploads', filename);
    const writeStream = fs.createWriteStream(filePath);

    file.pipe(writeStream);

    writeStream.on('finish', () => {
      const readStream = fs.createReadStream(filePath);

      pdfParse(readStream).then((data) => {
        req.body.resumeText = data.text;
        req.body.resumePath = filePath;

        // Save the application to the database
        const application = new Application(req.body);
        application.save((err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error saving application to database');
          } else {
            res.status(201).send('Application submitted successfully');
          }
        });
      });
    });
  });

  // End the request
  busboy.end(req.req);
});

// Export the router
module.exports = router;