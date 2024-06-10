const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/ats_database';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  educationLevel: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  university: { type: String, required: false },
  motivationLetter: { type: String, required: false },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true },
  resumePath: { type: String, required: false },
  resumeText: { type: String, required: false },
  status: { type: String, default: 'in review' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

const universities = [
  "Université de Tunis", "Université de Carthage", "Université de Sfax", "Université de Sousse",
  "Université de Monastir", "Université de Jendouba", "Université de Gafsa", "Université de Gabès",
  "Université Virtuelle de Tunis", "Université de Kairouan", "Université de La Manouba",
  // Add more universities as needed...
];

const jobIds = [
  '6664ee1f61bebfc879082477', '6664ee1f61bebfc879082479', '6664ee1f61bebfc87908247b',
  '6664ee1f61bebfc87908247d', '6664ee1f61bebfc87908247f', '6664ee1f61bebfc879082481',
  '6664ee1f61bebfc879082483', '6664ee1f61bebfc879082485', '6664ee1f61bebfc879082487',
  '6664ee1f61bebfc879082489', '6664ee1f61bebfc87908248b', '6664ee1f61bebfc87908248d',
  '6664ee1f61bebfc87908248f', '6664ee1f61bebfc879082491', '6664ee1f61bebfc879082493',
  '6664ee1f61bebfc879082495', '6664ee1f61bebfc879082497', '6664ee1f61bebfc879082499',
  '6664ee1f61bebfc87908249d', '6664ee1f61bebfc87908249b'
];

const statuses = [
  'declined', 'accepted for interview', 'accepted', 'declined after evaluation test', 'in review'
];

const educationLevels = ['Licence', 'Baccalaureate', 'Engineering'];
const experienceLevels = ['0 years', '1-3 years', '4-6 years', '7+ years'];

const resumeDir = 'C:/Users/Moemen/Desktop/ATS/ATS-Project/atsbackend/RESUME FILES';

const arabicTunisianNames = [
  'Mohamed', 'Ahmed', 'Fatma', 'Khalil', 'Nadia', 'Salah', 'Zahra', 'Karim', 'Amina', 'Ali', 'Mouna', 'Hana'
];

db.once('open', async () => {
  console.log('Connected to the database');

  for (let i = 0; i < 30; i++) {
    const name = `${faker.helpers.arrayElement(arabicTunisianNames)} ${faker.name.lastName()}`;
    const email = faker.internet.email(name.split(' ')[0], name.split(' ')[1]);
    const phone = faker.phone.phoneNumber('########');
    const educationLevel = faker.helpers.arrayElement(educationLevels);
    const experienceLevel = faker.helpers.arrayElement(experienceLevels);
    const university = faker.helpers.arrayElement(universities);
    const motivationLetter = faker.lorem.paragraphs(faker.datatype.number({ min: 2, max: 7 }));
    const jobId = faker.helpers.arrayElement(jobIds);
    const resumePath = path.join(resumeDir, faker.helpers.arrayElement(fs.readdirSync(resumeDir)));
    const resumeText = fs.readFileSync(resumePath, 'utf-8');
    const status = faker.helpers.arrayElement(statuses);
    const createdAt = faker.date.between('2024-05-15', '2024-06-06');

    const application = new Application({
      name,
      email,
      phone,
      educationLevel,
      experienceLevel,
      university,
      motivationLetter,
      jobId,
      resumePath,
      resumeText,
      status,
      createdAt,
    });

    try {
      await application.save();
      console.log(`Application ${i + 1} saved`);
    } catch (err) {
      console.error(`Error saving application ${i + 1}:`, err);
    }
  }

  console.log('All applications have been added');
  mongoose.connection.close();
});
