const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
    },
    educationLevel: {
        type: String,
        required: true,
        enum: ['licence', 'engineering', 'doctorate']
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['0 years', '1-3 years', '4-6 years', '7+ years']
    },
    university: {
        type: String,
        required: false  // Consider making this conditionally required based on education level
    },
    motivationLetter: {
        type: String,
        required: true
    },
    resumePath: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'in review',
        enum: ['in review', 'pre-accepted', 'rejected']
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobListing',
        required: true
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
