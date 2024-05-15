const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    educationLevel: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
