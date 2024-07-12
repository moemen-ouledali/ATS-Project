const express = require('express'); // Import Express
const router = express.Router(); // Create a new router object
const JobListing = require('../models/JobListing'); // Import JobListing model














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to create a new job listing
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/add', async (req, res) => {
    try {
        const newJobListing = new JobListing(req.body); // Create a new job listing with the request body data
        const savedListing = await newJobListing.save(); // Save the new job listing to the database
        res.status(201).json(savedListing); // Send the saved job listing as response with a 201 status code
    } catch (error) {
        console.error('Error adding job listing:', error); // Log any errors to the console
        res.status(500).json({ message: 'Failed to add job listing' }); // Send a 500 status code with an error message
    }
});














/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to delete a job listing
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/:id', async (req, res) => {
    try {
        const result = await JobListing.findByIdAndDelete(req.params.id); // Find and delete the job listing by ID
        if (!result) {
            return res.status(404).send('The job listing with the given ID was not found.'); // If not found, send a 404 status code with a message
        }
        res.send({ message: 'Job listing deleted successfully.' }); // Send a success message
    } catch (error) {
        console.error('Failed to delete job listing:', error); // Log any errors to the console
        res.status(500).send('Error deleting job listing'); // Send a 500 status code with an error message
    }
});















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to update a job listing
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put('/:id', async (req, res) => {
    try {
        const updatedListing = await JobListing.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Find and update the job listing by ID with new data
        if (!updatedListing) {
            return res.status(404).send('Job listing not found.'); // If not found, send a 404 status code with a message
        }
        res.send(updatedListing); // Send the updated job listing as response
    } catch (error) {
        console.error('Failed to update job listing:', error); // Log any errors to the console
        res.status(500).send('Error updating job listing'); // Send a 500 status code with an error message
    }
});












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to find all listings with optional category and jobType filter
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {
    let filter = {}; // Initialize an empty filter object
    const { category, jobType } = req.query; // Extract category and jobType from query parameters

    console.log("Queried Category:", category); // Debugging line to see what category is received
    console.log("Queried Job Type:", jobType); // Debugging line to see what job type is received

    if (category) filter.category = category; // If category is provided, add it to the filter
    if (jobType) filter.jobType = jobType; // If jobType is provided, add it to the filter

    console.log("Filter being applied:", filter); // Shows the full filter being applied to the find operation

    try {
        const listings = await JobListing.find(filter); // Find job listings with the applied filter
        console.log("Number of listings found:", listings.length); // Indicates how many listings were found
        res.json(listings); // Send the found job listings as response
    } catch (error) {
        console.error('Failed to get job listings:', error); // Log any errors to the console
        res.status(500).json({ message: 'Failed to get job listings' }); // Send a 500 status code with an error message
    }
});












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Route to get a single job listing by ID
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/:id', async (req, res) => {
    try {
        const jobListing = await JobListing.findById(req.params.id); // Find the job listing by ID
        if (!jobListing) {
            return res.status(404).send('The job listing with the given ID was not found.'); // If not found, send a 404 status code with a message
        }
        res.json(jobListing); // Send the found job listing as response
    } catch (error) {
        console.error('Error getting job listing details:', error); // Log any errors to the console
        res.status(500).send('Error getting job listing details'); // Send a 500 status code with an error message
    }
});











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router; // Export the router
