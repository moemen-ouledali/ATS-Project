const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    jobType: String, // e.g., Full-time, Part-time
    description: { type: String, required: true },
    requirements: String,
    salaryRange: String,
    experienceLevel: String,
    category: {
        type: String,
        required: true,
        enum: ['Web & Mobile Development', 'Business Intelligence', 'Digital Marketing & Design']
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
    // Add any other fields you think are necessary
}, { timestamps: true });

const JobListing = mongoose.model('JobListing', jobListingSchema);

module.exports = JobListing;
