const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing'); // Ensure this path correctly points to your JobListing model
console.log(JobListing); // This should log a function or model definition.

// Route to create a new job listing
router.post('/add', async (req, res) => {
    try {
        const { title, company, location, jobType, description, requirements, salaryRange, experienceLevel } = req.body;
        
        // Optionally, add validation or checks here

        const newJobListing = new JobListing({
            title,
            company,
            location,
            jobType,
            description,
            requirements,
            salaryRange,
            experienceLevel,
            // If you still need to reference the user who posted the job listing, you'll need to ensure
            // you have another way to determine the user's ID (e.g., from the request body, if the frontend sends it).
        });

        const savedListing = await newJobListing.save();
        res.status(201).json(savedListing);
    } catch (error) {
        console.error('Error adding job listing:', error);
        res.status(500).json({ message: 'Failed to add job listing' });
    }
});


// Delete a job listing
router.delete('/:id', async (req, res) => {
    try {
        const result = await JobListing.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send('The job listing with the given ID was not found.');
        }
        res.send({ message: 'Job listing deleted successfully.' });
    } catch (error) {
        console.error('Failed to delete job listing:', error);
        res.status(500).send('Error deleting job listing');
    }
});


// Route to find listings
router.get('/', async (req, res) => {
    try {
        const listings = await JobListing.find();
        res.json(listings);
    } catch (error) {
        console.error('Failed to get job listings:', error);
        res.status(500).json({ message: 'Failed to get job listings' });
    }
});


module.exports = router;
