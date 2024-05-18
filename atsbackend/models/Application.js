const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    educationLevel: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    university: { type: String, required: false },
    motivationLetter: { type: String, required: false },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true }, // Updated reference to JobListing
    resumePath: { type: String, required: false },
    resumeText: { type: String, required: false },
    status: { type: String, default: 'in review' }, // New field with default value
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
