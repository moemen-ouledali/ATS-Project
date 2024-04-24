
const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing');

// Route to create a new job listing
router.post('/add', async (req, res) => {
    try {
        const newJobListing = new JobListing(req.body);
        const savedListing = await newJobListing.save();
        res.status(201).json(savedListing);
    } catch (error) {
        console.error('Error adding job listing:', error);
        res.status(500).json({ message: 'Failed to add job listing' });
    }
});

// Route to delete a job listing
router.delete('/:id', async (req, res) => {
    try {
        const result = await JobListing.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('The job listing with the given ID was not found.');
        }
        res.send({ message: 'Job listing deleted successfully.' });
    } catch (error) {
        console.error('Failed to delete job listing:', error);
        res.status(500).send('Error deleting job listing');
    }
});

// Route to update a job listing
router.put('/:id', async (req, res) => {
    try {
        const updatedListing = await JobListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedListing) {
            return res.status(404).send('Job listing not found.');
        }
        res.send(updatedListing);
    } catch (error) {
        console.error('Failed to update job listing:', error);
        res.status(500).send('Error updating job listing');
    }
});

// Route to find all listings with optional category and jobType filter
router.get('/', async (req, res) => {
    let filter = {};
    const { category, jobType } = req.query;

    console.log("Queried Category:", category); // Debugging line to see what category is received
    console.log("Queried Job Type:", jobType); // Debugging line to see what job type is received

    if (category) filter.category = category;
    if (jobType) filter.jobType = jobType;

    console.log("Filter being applied:", filter); // Shows the full filter being applied to the find operation

    try {
        const listings = await JobListing.find(filter);
        console.log("Number of listings found:", listings.length); // Indicates how many listings were found
        res.json(listings);
    } catch (error) {
        console.error('Failed to get job listings:', error);
        res.status(500).json({ message: 'Failed to get job listings' });
    }
});

// Route to get a single job listing by ID
router.get('/:id', async (req, res) => {
    try {
        const jobListing = await JobListing.findById(req.params.id);
        if (!jobListing) {
            return res.status(404).send('The job listing with the given ID was not found.');
        }
        res.json(jobListing);
    } catch (error) {
        console.error('Error getting job listing details:', error);
        res.status(500).send('Error getting job listing details');
    }
});

module.exports = router;