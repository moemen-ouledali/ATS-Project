// deleteAllJobs.js
const mongoose = require('mongoose');
const JobListing = require('./models/JobListing'); // Adjust the path as necessary

mongoose.connect('mongodb://localhost:27017/ats_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    return JobListing.deleteMany({});
}).then(() => {
    console.log('All jobs deleted');
    mongoose.disconnect();
}).catch(err => {
    console.error('Error deleting jobs:', err);
    mongoose.disconnect();
});
