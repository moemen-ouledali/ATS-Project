// Import necessary modules
const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing');
















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to create a new job listing
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/add', async (req, res) => {
    try {
        // Create a new job listing from the request body
        const newJobListing = new JobListing(req.body);
        // Save the new job listing to the database
        const savedListing = await newJobListing.save();
        // Respond with the saved listing and a 201 status (Created)
        res.status(201).json(savedListing);
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Error adding job listing:', error);
        res.status(500).json({ message: 'Failed to add job listing' });
    }
});





















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to delete a job listing by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete('/:id', async (req, res) => {
    try {
        // Find and delete the job listing by ID
        const result = await JobListing.findByIdAndDelete(req.params.id);
        // If no job listing is found, respond with a 404 status (Not Found)
        if (!result) {
            return res.status(404).send('The job listing with the given ID was not found.');
        }
        // Respond with a success message
        res.send({ message: 'Job listing deleted successfully.' });
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Failed to delete job listing:', error);
        res.status(500).send('Error deleting job listing');
    }
});


















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to update a job listing by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.put('/:id', async (req, res) => {
    try {
        // Find and update the job listing by ID with new data
        const updatedListing = await JobListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // If no job listing is found, respond with a 404 status (Not Found)
        if (!updatedListing) {
            return res.status(404).send('Job listing not found.');
        }
        // Respond with the updated listing
        res.send(updatedListing);
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Failed to update job listing:', error);
        res.status(500).send('Error updating job listing');
    }
});





















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to find all job listings with optional category and jobType filters
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/', async (req, res) => {
    let filter = {};
    const { category, jobType } = req.query;

    // Debugging lines to see what category and job type are received
    console.log("Queried Category:", category);
    console.log("Queried Job Type:", jobType);

    // Apply filters if category or job type are specified
    if (category) filter.category = category;
    if (jobType) filter.jobType = jobType;

    // Show the full filter being applied to the find operation
    console.log("Filter being applied:", filter);

    try {
        // Find all job listings that match the filter
        const listings = await JobListing.find(filter);
        // Log the number of listings found
        console.log("Number of listings found:", listings.length);
        // Respond with the found listings
        res.json(listings);
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Failed to get job listings:', error);
        res.status(500).json({ message: 'Failed to get job listings' });
    }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to get a single job listing by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/:id', async (req, res) => {
    try {
        // Find the job listing by ID
        const jobListing = await JobListing.findById(req.params.id);
        // If no job listing is found, respond with a 404 status (Not Found)
        if (!jobListing) {
            return res.status(404).send('The job listing with the given ID was not found.');
        }
        // Respond with the found job listing
        res.json(jobListing);
    } catch (error) {
        // Log any errors and respond with a 500 status (Server Error)
        console.error('Error getting job listing details:', error);
        res.status(500).send('Error getting job listing details');
    }
});











// Export the router so it can be used in the main application
module.exports = router;
