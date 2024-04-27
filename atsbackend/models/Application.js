const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    educationLevel: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true },
    resumePath: { type: String, required: true }, // Path to the stored resume file
    resumeText: { type: String } // Optional: Store additional text or metadata related to the resume
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
