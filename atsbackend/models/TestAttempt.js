const mongoose = require('mongoose');

const TestAttemptSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  answers: [{
    question: String,
    givenAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  score: { type: Number, required: true },
});

const TestAttempt = mongoose.model('TestAttempt', TestAttemptSchema);

module.exports = TestAttempt;
