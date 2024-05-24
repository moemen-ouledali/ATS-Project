const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    jobLocation: { type: String, required: true }, // e.g., Online, On board
    jobType: { type: String, required: true }, // e.g., Full-time, Internship
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    minimumDegree: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
}, { timestamps: true });

const JobListing = mongoose.model('JobListing', jobListingSchema);

module.exports = JobListing;
