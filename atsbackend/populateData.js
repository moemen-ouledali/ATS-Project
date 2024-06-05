const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Application schema
const applicationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  educationLevel: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  university: { type: String, required: false },
  motivationLetter: { type: String, required: false },
  jobId: { type: Schema.Types.ObjectId, ref: 'JobListing', required: true },
  resumePath: { type: String, required: false },
  resumeText: { type: String, required: false },
  status: { type: String, default: 'in review' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define the User schema
const userSchema = new Schema({
  role: { type: String, required: true, enum: ['Candidate', 'Manager', 'Admin'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: String, required: function() { return this.role !== 'Manager'; } },
  highestEducationLevel: { type: String, required: function() { return this.role !== 'Manager'; }, enum: ['Baccalaureate', 'Licence', 'Engineering'] },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  verificationCode: String,
  isVerified: { type: Boolean, default: true }
});

// Define the models
const Application = mongoose.model('Application', applicationSchema);
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ats_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Helper functions
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateRandomString = (length) => Math.random().toString(36).substring(2, 2 + length);

// Data arrays
const arabicNames = [
  "Mohamed", "Ahmed", "Hassan", "Fatma", "Amina", "Ali", "Hela", "Nour", "Youssef", "Zahra",
  "Mouna", "Samir", "Salma", "Hamdi", "Malek", "Maha", "Aymen", "Nada", "Rami", "Amira"
];
const surnames = ["Ben Salah", "Ben Ali", "Trabelsi", "Mansouri", "Hajri", "Chaabane", "Khaldi", "Gharbi"];
const educationLevels = ["Licence", "Baccalaureate", "Engineering"];
const experienceLevels = ["0 years", "1-3 years", "4-6 years", "7+ years"];
const universities = ["esprit", "isg", "ihec", "esb", "istic", "tek-up", "sesame"];
const jobIds = ["66527e4bc3b3e3c2f569ab99", "66527e87c3b3e3c2f569aba2", "66527f3bc3b3e3c2f569abbf", "66527f76c3b3e3c2f569abc3", "66527fa6c3b3e3c2f569abc6"];
const statuses = ["declined", "accepted for interview", "accepted", "declined after evaluation test", "in review"];
const cities = ["tunis", "manouba", "sfax", "nabeul", "bizerte", "tataouine", "beja"];
const genders = ["male", "female"];

// Create applications and users
const createApplicationsAndUsers = async () => {
  for (let i = 0; i < 30; i++) {
    const firstName = getRandomElement(arabicNames);
    const lastName = getRandomElement(surnames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = `${Math.floor(10000000 + Math.random() * 90000000)}`;
    const educationLevel = getRandomElement(educationLevels);
    const experienceLevel = getRandomElement(experienceLevels);
    const university = getRandomElement(universities);
    const motivationLetter = "This is my motivation letter. I am excited about the opportunity.";
    const jobId = getRandomElement(jobIds);
    const resumePath = `/resumes/${generateRandomString(10)}.pdf`;
    const resumeText = "This is the resume text. It contains the details of my professional background.";
    const status = getRandomElement(statuses);
    const createdAt = new Date(2024, 4, 15 + Math.floor(Math.random() * 23));

    const newApplication = new Application({
      name: `${firstName} ${lastName}`,
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

    const dateOfBirth = new Date(1990 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    const city = getRandomElement(cities);
    const gender = getRandomElement(genders);
    const password = generateRandomString(8);

    const newUser = new User({
      role: 'Candidate',
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      phoneNumber: phone,
      city,
      highestEducationLevel: educationLevel,
      gender,
      isVerified: true
    });

    try {
      await newApplication.save();
      await newUser.save();
      console.log(`Created application and user for ${firstName} ${lastName}`);
    } catch (error) {
      console.error('Error creating application or user:', error);
    }
  }
};

createApplicationsAndUsers()
  .then(() => {
    console.log('Data population complete.');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Data population failed:', err);
    mongoose.disconnect();
  });
