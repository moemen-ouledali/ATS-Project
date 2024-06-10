const mongoose = require('mongoose');

// Replace the URI with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/ats_database'; // Change 'yourDatabaseName' to your actual database name

mongoose.connect(mongoURI, {
  // These options are deprecated, you can remove them
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to the database');

  // List all collections in the database
  const collections = await db.db.listCollections().toArray();
  console.log('Collections in the database:', collections);

  // Define the application schema and model with the correct collection name
  const applicationSchema = new mongoose.Schema({}, { collection: 'applications' });
  const Application = mongoose.model('Application', applicationSchema);

  try {
    // Delete all documents from the applications collection
    const result = await Application.deleteMany({});
    console.log('DeleteMany result:', result);

    const remainingApplications = await Application.find({});
    console.log('Remaining applications:', remainingApplications);
  } catch (err) {
    console.error('Failed to delete applications:', err);
  } finally {
    mongoose.connection.close();
  }
});
