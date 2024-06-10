const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
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
const arabicNames = [
  "Mohamed", "Ahmed", "Hassan", "Fatma", "Amina", "Ali", "Hela", "Nour", "Youssef", "Zahra",
  "Mouna", "Samir", "Salma", "Hamdi", "Malek", "Maha", "Aymen", "Nada", "Rami", "Amira"
];
const surnames = ["Ben Salah", "Ben Ali", "Trabelsi", "Mansouri", "Hajri", "Chaabane", "Khaldi", "Gharbi"];
const educationLevels = ["Licence", "Baccalaureate", "Engineering"];
const experienceLevels = ["0 years", "1-3 years", "4-6 years", "7+ years"];
const universities = [
  "Université de Tunis", "Université de Carthage", "Université de Sfax", "Université de Sousse", "Université de Monastir",
  "Université de Jendouba", "Université de Gafsa", "Université de Gabès", "Université Virtuelle de Tunis", "Université de Kairouan",
  "Université de La Manouba", "Université Centrale", "Université Libre de Tunis (ULT)", "Université Tunis Carthage (UTC)",
  "Université Centrale Privée des Sciences et Technologies de la Santé (UCST)", "Institut Supérieur Privé des Technologies de l'Informatique et de Management (ITIM)",
  "Université Internationale de Tunis (UIT)", "Université Paris-Dauphine Tunis", "Université Privée de Tunis (UPT)",
  "École Supérieure Privée d'Ingénierie et de Technologies (ESPRIT)", "Institut Supérieur Privé de Gestion de Tunis (ISG Tunis)",
  "Institut Supérieur Privé des Sciences de la Santé de Tunis (ISSST)", "Université Tunis El Manar", "Université Arabe des Sciences (UAS)",
  "Institut Supérieur Privé d’Administration des Entreprises (ISPAE)", "Institut Supérieur Privé de Gestion de Sousse (ISG Sousse)",
  "Université des Sciences de l'Informatique et de Management (USIM)", "Université Ibn Khaldoun",
  "Institut Supérieur Privé des Technologies de l'Information et de la Communication (SUPTECH)", "Université des Sciences et Technologies de Tunis (USTT)",
  "Université Libre des Sciences et Technologies (ULST)", "Université des Sciences Économiques et de Gestion (USEG)",
  "Institut Supérieur Privé des Sciences et Techniques de Sousse (ISSTS)", "Institut Supérieur Privé des Technologies d'Informatique et de Management de Sfax (ISTIMS)",
  "École Supérieure Privée de Génie Civil et de Technologie (ESGCT)", "Institut Privé de Haute Études de Carthage (IHEC Carthage)",
  "Institut Supérieur Privé d'Études Paramédicales de Tunis (ISPET)", "Institut Supérieur Privé des Sciences et Technologies Appliquées de Sfax (ISSTAS)",
  "Institut Supérieur Privé des Sciences de la Santé de Sousse (ISSOS)", "Université Centrale Privée des Sciences Juridiques et Politiques (UCJSP)",
  "Université des Sciences de l'Informatique et de Communication (USIC)", "Université des Sciences et Technologies de Gafsa (USTG)",
  "Institut Supérieur Privé des Sciences et Technologies de Monastir (ISSTM)", "Université des Sciences Appliquées et de Management (USAM)",
  "Université des Sciences et Technologies de Kairouan (USTK)", "Université des Sciences de la Santé de Tunis (USST)",
  "Institut Supérieur Privé de Gestion de Bizerte (ISGB)", "Université Privée des Sciences de l'Informatique de Nabeul (USIN)",
  "Université Centrale Privée des Sciences et Technologies de Gabès (UCSTG)", "Institut Supérieur Privé de Management de Gafsa (ISMG)",
  "Université des Sciences et Technologies Appliquées de Jendouba (USTAJ)", "Université des Sciences et Technologies de Mahdia (USTM)",
  "Institut Supérieur Privé de Gestion et de Technologies de Bizerte (ISGTB)", "Université des Sciences Appliquées et de Technologies de Médenine (USATM)",
  "Institut Supérieur Privé de Gestion de Nabeul (ISGN)", "Université Centrale Privée des Sciences Appliquées de Sousse (UCPAS)",
  "Université des Sciences de l'Informatique et de Management de Kébili (USIMK)", "Université des Sciences et Technologies Appliquées de Siliana (USTAS)",
  "Institut Supérieur Privé de Gestion et de Technologies de Kairouan (ISGTK)", "Université des Sciences Appliquées et de Technologies de Kébili (USATK)",
  "Institut Supérieur Privé de Gestion de Sidi Bouzid (ISGSB)"
];
const jobIds = [
  "6664ee1f61bebfc879082477", "6664ee1f61bebfc879082479", "6664ee1f61bebfc87908247b", "6664ee1f61bebfc87908247d",
  "6664ee1f61bebfc87908247f", "6664ee1f61bebfc879082481", "6664ee1f61bebfc879082483", "6664ee1f61bebfc879082485",
  "6664ee1f61bebfc879082487", "6664ee1f61bebfc879082489", "6664ee1f61bebfc87908248b", "6664ee1f61bebfc87908248d",
  "6664ee1f61bebfc87908248f", "6664ee1f61bebfc879082491", "6664ee1f61bebfc879082493", "6664ee1f61bebfc879082495",
  "6664ee1f61bebfc879082497", "6664ee1f61bebfc879082499", "6664ee1f61bebfc87908249d", "6664ee1f61bebfc87908249b"
];
const statuses = ["declined", "accepted for interview", "accepted", "declined after evaluation test", "in review"];
const cities = ["Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];
const genders = ["male", "female"];

// Read and parse a PDF file to extract text
const extractResumeText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error reading or parsing PDF file:', error);
    return 'Resume text could not be retrieved.';
  }
};

// Create applications and users
const createApplicationsAndUsers = async () => {
  const resumeFilesDirectory = 'C:\\Users\\Moemen\\Desktop\\ATS\\ATS-Project\\atsbackend\\RESUME FILES';
  const resumeFiles = fs.readdirSync(resumeFilesDirectory).filter(file => file.endsWith('.pdf'));

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
    const resumeFile = getRandomElement(resumeFiles);
    const resumePath = path.join(resumeFilesDirectory, resumeFile);
    const resumeText = await extractResumeText(resumePath);
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
