// models/Interview.js
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Interview', interviewSchema);
