const mongoose = require('mongoose');
const Question = require('./models/Question');
const Test = require('./models/Test');

mongoose.connect('mongodb://localhost:27017/ats_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  addTestData();
}).catch(err => console.error('Could not connect to MongoDB', err));

const addTestData = async () => {
  try {
    const webMobileQuestions = [
      {
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyper Tabular Markup Language'],
        correctOption: 'Hyper Text Markup Language',
      },
      {
        question: 'Which language is used for styling web pages?',
        options: ['HTML', 'JQuery', 'CSS'],
        correctOption: 'CSS',
      },
      {
        question: 'Which is not a JavaScript framework?',
        options: ['Python Script', 'JQuery', 'Django'],
        correctOption: 'Django',
      },
      {
        question: 'Which is used for Connect To Database?',
        options: ['PHP', 'HTML', 'JS'],
        correctOption: 'PHP',
      },
      {
        question: 'Which of the following is not a programming language?',
        options: ['Python', 'HTML', 'Scala'],
        correctOption: 'HTML',
      },
      {
        question: 'What does CSS stand for?',
        options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets'],
        correctOption: 'Cascading Style Sheets',
      },
      {
        question: 'Which HTML attribute is used to define inline styles?',
        options: ['class', 'styles', 'style'],
        correctOption: 'style',
      },
      {
        question: 'Which is not an HTML5 element?',
        options: ['header', 'footer', 'blink'],
        correctOption: 'blink',
      },
      {
        question: 'How can you add a comment in a JavaScript?',
        options: ['<!--This is a comment-->', '//This is a comment', '/*This is a comment*/'],
        correctOption: '//This is a comment',
      },
      {
        question: 'Which of the following is not a way to declare a variable in JavaScript?',
        options: ['var', 'let', 'int'],
        correctOption: 'int',
      },
      {
        question: 'What is the correct HTML element for inserting a line break?',
        options: ['<br>', '<lb>', '<break>'],
        correctOption: '<br>',
      },
      {
        question: 'Which of these is a JavaScript package manager?',
        options: ['Node.js', 'TypeScript', 'npm'],
        correctOption: 'npm',
      },
      {
        question: 'Which tool can you use to ensure code quality?',
        options: ['Angular', 'jQuery', 'ESLint'],
        correctOption: 'ESLint',
      },
      {
        question: 'What is the correct syntax to refer to an external script called "xxx.js"?',
        options: ['<script href="xxx.js">', '<script name="xxx.js">', '<script src="xxx.js">'],
        correctOption: '<script src="xxx.js">',
      },
      {
        question: 'Which company developed JavaScript?',
        options: ['Netscape', 'Microsoft', 'Google'],
        correctOption: 'Netscape',
      },
      {
        question: 'What is the correct syntax for referring to an external style sheet?',
        options: ['<style src="mystyle.css">', '<stylesheet>mystyle.css</stylesheet>', '<link rel="stylesheet" type="text/css" href="mystyle.css">'],
        correctOption: '<link rel="stylesheet" type="text/css" href="mystyle.css">',
      },
      {
        question: 'Which HTML tag is used to define an internal style sheet?',
        options: ['<css>', '<style>', '<script>'],
        correctOption: '<style>',
      },
      {
        question: 'In CSS, how do you select an element with id "demo"?',
        options: ['.demo', '*demo', '#demo'],
        correctOption: '#demo',
      },
      {
        question: 'Which HTML element is used to display a scalar measurement within a range?',
        options: ['<gauge>', '<measure>', '<meter>'],
        correctOption: '<meter>',
      },
      {
        question: 'How do you call a function named "myFunction" in JavaScript?',
        options: ['call myFunction()', 'myFunction()', 'call function myFunction'],
        correctOption: 'myFunction()',
      },
    ];

    const biQuestions = [
      {
        question: 'What is Business Intelligence?',
        options: ['Data collection', 'Data analysis', 'Both A and B'],
        correctOption: 'Both A and B',
      },
      {
        question: 'Which tool is commonly used for data visualization?',
        options: ['Tableau', 'Photoshop', 'Word'],
        correctOption: 'Tableau',
      },
      {
        question: 'Which of the following is not a BI tool?',
        options: ['Power BI', 'QlikView', 'AutoCAD'],
        correctOption: 'AutoCAD',
      },
      {
        question: 'ETL stands for?',
        options: ['Extract, Transform, Load', 'Extract, Transfer, Load', 'Extract, Translate, Load'],
        correctOption: 'Extract, Transform, Load',
      },
      {
        question: 'Which language is commonly used for statistical analysis?',
        options: ['Python', 'Java', 'HTML'],
        correctOption: 'Python',
      },
      {
        question: 'What does OLAP stand for?',
        options: ['Online Analytical Processing', 'Online Analytical Programming', 'Online Analysis Process'],
        correctOption: 'Online Analytical Processing',
      },
      {
        question: 'Which one is a NoSQL database?',
        options: ['MySQL', 'Oracle', 'MongoDB'],
        correctOption: 'MongoDB',
      },
      {
        question: 'In data warehousing, what is a fact table?',
        options: ['A table containing detailed business data', 'A table containing aggregated data', 'A table containing metadata'],
        correctOption: 'A table containing detailed business data',
      },
      {
        question: 'What is a data cube?',
        options: ['A multi-dimensional array of values', 'A single-dimensional array of values', 'A set of unrelated data'],
        correctOption: 'A multi-dimensional array of values',
      },
      {
        question: 'Which of the following is not a type of data warehouse?',
        options: ['Enterprise Data Warehouse', 'Operational Data Store', 'Relational Data Store'],
        correctOption: 'Relational Data Store',
      },
      {
        question: 'What is the main goal of data mining?',
        options: ['Extract useful information from large datasets', 'Store large datasets', 'Transfer data'],
        correctOption: 'Extract useful information from large datasets',
      },
      {
        question: 'Which tool is used for Big Data analytics?',
        options: ['Hadoop', 'Photoshop', 'AutoCAD'],
        correctOption: 'Hadoop',
      },
      {
        question: 'Which of the following is a BI reporting tool?',
        options: ['SQL Server Reporting Services', 'AutoCAD', 'Photoshop'],
        correctOption: 'SQL Server Reporting Services',
      },
      {
        question: 'What does KPI stand for?',
        options: ['Key Performance Indicator', 'Key Process Indicator', 'Key Project Indicator'],
        correctOption: 'Key Performance Indicator',
      },
      {
        question: 'Which of the following is not a step in the data warehousing process?',
        options: ['Data Cleaning', 'Data Integration', 'Data Broadcasting'],
        correctOption: 'Data Broadcasting',
      },
      {
        question: 'Which of the following is used to extract data from different sources?',
        options: ['ETL', 'ERP', 'CRM'],
        correctOption: 'ETL',
      },
      {
        question: 'Which tool is commonly used for data extraction?',
        options: ['Informatica', 'AutoCAD', 'Photoshop'],
        correctOption: 'Informatica',
      },
      {
        question: 'What is a dimension table?',
        options: ['A table containing detailed business data', 'A table containing descriptive information', 'A table containing metadata'],
        correctOption: 'A table containing descriptive information',
      },
      {
        question: 'Which of the following is not a benefit of data warehousing?',
        options: ['Improved data quality', 'Faster data retrieval', 'Increased data redundancy'],
        correctOption: 'Increased data redundancy',
      },
      {
        question: 'What is the purpose of a BI dashboard?',
        options: ['To visualize key performance indicators', 'To store large datasets', 'To clean data'],
        correctOption: 'To visualize key performance indicators',
      },
    ];

    const digitalMarketingQuestions = [
      {
        question: 'What is SEO?',
        options: ['Search Engine Optimization', 'Social Engine Optimization', 'Search Engine Organization'],
        correctOption: 'Search Engine Optimization',
      },
      {
        question: 'Which platform is commonly used for social media marketing?',
        options: ['Facebook', 'Slack', 'Github'],
        correctOption: 'Facebook',
      },
      {
        question: 'What does PPC stand for?',
        options: ['Pay Per Click', 'Pay Per Cost', 'Pay Per Content'],
        correctOption: 'Pay Per Click',
      },
      {
        question: 'Which tool is used for keyword research?',
        options: ['Google Analytics', 'Google AdWords', 'Google Drive'],
        correctOption: 'Google AdWords',
      },
      {
        question: 'What is content marketing?',
        options: ['Creating and distributing valuable content', 'Creating ads', 'Selling products online'],
        correctOption: 'Creating and distributing valuable content',
      },
      {
        question: 'Which of the following is not a social media platform?',
        options: ['Instagram', 'LinkedIn', 'Google Drive'],
        correctOption: 'Google Drive',
      },
      {
        question: 'What is the main goal of email marketing?',
        options: ['To build customer loyalty', 'To store customer data', 'To track website traffic'],
        correctOption: 'To build customer loyalty',
      },
      {
        question: 'What does CTA stand for?',
        options: ['Call to Action', 'Click to Add', 'Cost to Action'],
        correctOption: 'Call to Action',
      },
      {
        question: 'What is affiliate marketing?',
        options: ['Promoting other people’s products', 'Creating ads', 'Selling products online'],
        correctOption: 'Promoting other people’s products',
      },
      {
        question: 'Which tool is used to measure website traffic?',
        options: ['Google Analytics', 'Google AdWords', 'Google Drive'],
        correctOption: 'Google Analytics',
      },
      {
        question: 'What is the purpose of a landing page?',
        options: ['To convert visitors into leads', 'To display ads', 'To track website traffic'],
        correctOption: 'To convert visitors into leads',
      },
      {
        question: 'Which of the following is a metric used in digital marketing?',
        options: ['Click-Through Rate', 'Bounce Rate', 'Both A and B'],
        correctOption: 'Both A and B',
      },
      {
        question: 'What is influencer marketing?',
        options: ['Using influential people to promote products', 'Creating ads', 'Selling products online'],
        correctOption: 'Using influential people to promote products',
      },
      {
        question: 'Which platform is commonly used for video marketing?',
        options: ['YouTube', 'Slack', 'Github'],
        correctOption: 'YouTube',
      },
      {
        question: 'What does SEM stand for?',
        options: ['Search Engine Marketing', 'Social Engine Marketing', 'Search Engine Management'],
        correctOption: 'Search Engine Marketing',
      },
      {
        question: 'Which of the following is not a type of digital marketing?',
        options: ['Content Marketing', 'Search Engine Optimization', 'Product Marketing'],
        correctOption: 'Product Marketing',
      },
      {
        question: 'What is the main goal of a digital marketing campaign?',
        options: ['To increase brand awareness', 'To store customer data', 'To track website traffic'],
        correctOption: 'To increase brand awareness',
      },
      {
        question: 'Which of the following is a benefit of digital marketing?',
        options: ['Global reach', 'High costs', 'Limited tracking'],
        correctOption: 'Global reach',
      },
      {
        question: 'What is a digital marketing funnel?',
        options: ['A model that illustrates the path a customer takes from awareness to purchase', 'A tool to track website traffic', 'A platform for social media marketing'],
        correctOption: 'A model that illustrates the path a customer takes from awareness to purchase',
      },
      {
        question: 'Which of the following is not a social media marketing strategy?',
        options: ['Posting regularly', 'Engaging with followers', 'Ignoring comments'],
        correctOption: 'Ignoring comments',
      },
    ];

    const createQuestions = async (questions) => {
      return await Question.insertMany(questions);
    };

    const webMobileQuestionDocs = await createQuestions(webMobileQuestions);
    const biQuestionDocs = await createQuestions(biQuestions);
    const digitalMarketingQuestionDocs = await createQuestions(digitalMarketingQuestions);

    const createTest = async (category, questionDocs) => {
      const test = new Test({
        category,
        questions: questionDocs.map(q => q._id),
      });
      await test.save();
    };

    await createTest('Web & Mobile Development', webMobileQuestionDocs);
    await createTest('Business Intelligence', biQuestionDocs);
    await createTest('Digital Marketing', digitalMarketingQuestionDocs);

    console.log('Test data added successfully');
    process.exit();
  } catch (error) {
    console.error('Error adding test data:', error);
    process.exit(1);
  }
};
