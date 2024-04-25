const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobId: String,
  resumePath: String,
  resumeText: String,
});

module.exports = mongoose.model('Application', ApplicationSchema);