const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcrypt');

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/yourDatabaseName';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
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
  isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const cities = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Kef', 
  'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 
  'Tozeur', 'Tunis', 'Zaghouan'
];

const arabicTunisianNames = [
  'Mohamed', 'Ahmed', 'Fatma', 'Khalil', 'Nadia', 'Salah', 'Zahra', 'Karim', 'Amina', 'Ali', 'Mouna', 'Hana'
];

db.once('open', async () => {
  console.log('Connected to the database');

  for (let i = 0; i < 40; i++) {
    const firstName = faker.random.arrayElement(arabicTunisianNames);
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const dateOfBirth = faker.date.between('1990-01-01', '2005-12-31');
    const password = await bcrypt.hash(faker.internet.password(), 10);
    const phoneNumber = faker.phone.phoneNumber('########');
    const city = faker.random.arrayElement(cities);
    const highestEducationLevel = faker.random.arrayElement(['Baccalaureate', 'Licence', 'Engineering']);
    const gender = faker.random.arrayElement(['male', 'female']);

    const user = new User({
      role: 'Candidate',
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      phoneNumber,
      city,
      highestEducationLevel,
      gender,
      isVerified: true,
    });

    try {
      await user.save();
      console.log(`User ${i + 1} saved`);
    } catch (err) {
      console.error(`Error saving user ${i + 1}:`, err);
    }
  }

  console.log('All users have been added');
  mongoose.connection.close();
});
