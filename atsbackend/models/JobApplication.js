const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    degree: { type: String, required: true },
    motivationLetter: String,
    resumeText: String, // Assuming you're extracting text from the resume PDF
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true }, // Reference to the job being applied to
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the applicant (user)
    status: {
        type: String,
        default: 'in review', // or whatever your default status is
        enum: ['in review', 'accepted', 'declined']
      },
}, { timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
