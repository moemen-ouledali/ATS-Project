const mongoose = require('mongoose');
const TestAttempt = require('./models/TestAttempt'); // Adjust the path as necessary

const testIds = [
  new mongoose.Types.ObjectId('66551a3253e5631d37ded500'),
  new mongoose.Types.ObjectId('66551a3253e5631d37ded502'),
  new mongoose.Types.ObjectId('66551a3253e5631d37ded504')
];

const applicationIds = [
  new mongoose.Types.ObjectId('66673d70158a18fc1175edf3'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175edf8'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175edfc'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee3d'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee41'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee01'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee39'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee05'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee35'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee31'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee09'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee25'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee29'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee2d'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee21'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee1d'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee19'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee0d'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee15'),
  new mongoose.Types.ObjectId('66673d70158a18fc1175ee11')
];

const userIds = [
  new mongoose.Types.ObjectId('664cc32d6f9d487907c267f6'),
  new mongoose.Types.ObjectId('664f58b0589b65b2beceb59a'),
  new mongoose.Types.ObjectId('664fdf7ec039b32ebb611501'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ee4'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ed0'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ee0'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ed4'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41edc'),
  new mongoose.Types.ObjectId('665c77d5f8dae558bde1c51a'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ecc'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ed8'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ec0'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ec8'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ec4'),
  new mongoose.Types.ObjectId('6651024e819fa93567bc8466'),
  new mongoose.Types.ObjectId('6657bc6ddca508ee89a9fa37'),
  new mongoose.Types.ObjectId('665c7768f8dae558bde1c514'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41ebb'),
  new mongoose.Types.ObjectId('665fa4c7057ceef474c41eb6'),
  new mongoose.Types.ObjectId('66528029c3b3e3c2f569abde')
];

const answers = ['a', 'b', 'c'];

const getRandomAnswers = () => {
  return Array.from({ length: 5 }, () => answers[Math.floor(Math.random() * answers.length)]);
};

const getRandomScore = () => {
  return Math.floor(Math.random() * 20) + 1;
};

const createTestAttempts = async () => {
  await mongoose.connect('mongodb://localhost:27017/ats_database', { useNewUrlParser: true, useUnifiedTopology: true });

  const testAttempts = applicationIds.map((applicationId, index) => {
    return new TestAttempt({
      test: testIds[index % testIds.length],
      user: userIds[index % userIds.length],
      application: applicationId,
      answers: getRandomAnswers(),
      score: getRandomScore()
    });
  });

  try {
    await TestAttempt.insertMany(testAttempts);
    console.log('Test attempts inserted successfully');
  } catch (error) {
    console.error('Error inserting test attempts:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestAttempts();
