// addJobListings.js
const mongoose = require('mongoose');
const JobListing = require('./models/JobListing'); // Adjust the path as necessary

const categories = {
    'Web & Mobile Development': [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP',
        'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'HTML', 'CSS', 'Scala', 'Perl', 'R',
        'Dart', 'MATLAB'
    ],
    'Business Intelligence': [
        'SQL', 'Python', 'R', 'JavaScript', 'SAS', 'Matlab', 'Scala', 'Julia', 'DAX', 
        'MDX', 'VBA', 'T-SQL', 'PL/SQL', 'HiveQL', 'Pig Latin', 'Power Query M', 'Perl',
        'Ruby', 'Go', 'Java'
    ],
    'Digital Marketing & Design': [
        'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch', 'Canva', 'Adobe XD', 
        'HTML', 'CSS', 'JavaScript', 'Google Analytics', 'Google Ads', 'Facebook Ads', 
        'SEO', 'SEM', 'WordPress', 'Mailchimp', 'Hootsuite', 'HubSpot', 'A/B Testing'
    ]
};

const locations = ['Technopole El Ghazala', 'Online'];
const jobTypes = ['Full-time', 'Internship'];
const experienceLevels = ['0 years', '1-3 years', '4-6 years', '7+ years'];
const degrees = ['Licence', 'Engineering', 'Baccalaureate'];

const jobNames = {
    'Web & Mobile Development': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile App Developer', 'Web Developer', 'React Developer', 'Angular Developer'],
    'Business Intelligence': ['BI Analyst', 'Data Scientist', 'Data Analyst', 'BI Developer', 'Data Engineer', 'BI Consultant'],
    'Digital Marketing & Design': ['Graphic Designer', 'Digital Marketer', 'SEO Specialist', 'Content Creator', 'Social Media Manager', 'Marketing Coordinator']
};

const jobDescriptions = {
    'Web & Mobile Development': 'Develop and maintain web/mobile applications.',
    'Business Intelligence': 'Analyze and interpret complex data.',
    'Digital Marketing & Design': 'Create and manage digital marketing campaigns and designs.'
};

mongoose.connect('mongodb://localhost:27017/ats_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    return createJobListings();
}).then(() => {
    console.log('Job listings created successfully');
    mongoose.disconnect();
}).catch(err => {
    console.error('Error creating job listings:', err);
    mongoose.disconnect();
});

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function createJobListings() {
    const jobListings = [];

    for (let i = 0; i < 50; i++) {
        const category = getRandomElement(Object.keys(categories));
        const title = getRandomElement(jobNames[category]);
        const description = jobDescriptions[category];
        const requirements = getRandomElements(categories[category], 4, 6);

        const jobListing = new JobListing({
            title,
            category,
            jobLocation: getRandomElement(locations),
            jobType: getRandomElement(jobTypes),
            description,
            requirements,
            experienceLevel: getRandomElement(experienceLevels),
            minimumDegree: getRandomElement(degrees),
            postedBy: new mongoose.Types.ObjectId() // Replace with a valid user ID if available
        });

        jobListings.push(jobListing);
    }

    return JobListing.insertMany(jobListings);
}

function getRandomElements(arr, min, max) {
    const numElements = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
}
