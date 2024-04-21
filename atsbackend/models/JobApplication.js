const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobListing', // Assuming 'JobListing' is your job listing model name
        required: true
    },
    applicantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is your user model name
        required: true
    },
    status: {
        type: String,
        enum: ['in review', 'pre-accepted', 'declined'],
        default: 'in review'
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    educationLevel: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    motivationLetter: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: true
    }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

console.log('JobApplication model loaded:', JobApplication);

module.exports = JobApplication;
