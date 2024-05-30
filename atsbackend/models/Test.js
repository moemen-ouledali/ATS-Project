const mongoose = require('mongoose');
const Question = require('./Question'); // Make sure this path is correct

const testSchema = new mongoose.Schema({
  category: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
