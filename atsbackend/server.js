const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const jobListingsRoutes = require('./routes/jobListingsRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ats_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(fileUpload()); // Add file upload support

// Parse PDF files
app.post('/api/parse-pdf', async (req, res) => {
  try {
    const { name, email, jobId } = req.body;
    const file = req.files.resume;

    // Save the uploaded file to a local directory
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    await file.mv(uploadPath);

    // Parse the PDF file
    const dataBuffer = fs.readFileSync(uploadPath);
    const resumeText = await pdfParse(dataBuffer);

    // Save the parsed data to the database
    const application = new Application({
      name,
      email,
      jobId,
      resumePath: uploadPath,
      resumeText: resumeText.text,
    });
    await application.save();

    // Send a response
    res.status(201).send('Application submitted successfully.');
  } catch (error) {
    console.error('Failed to process application:', error);
    res.status(500).send('Failed to process application: ' + error.message);
  }
});

// Use routes
app.use('/auth', authRoutes);
app.use('/api/jobs', jobListingsRoutes);
app.use('/api', applicationsRoutes);

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});