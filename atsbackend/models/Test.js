const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  category: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
