import React, { useState, useEffect, useContext } from 'react'; // Importing necessary React hooks and context
import { useParams, Link } from 'react-router-dom'; // Importing necessary components from React Router
import axios from 'axios'; // Importing axios for making HTTP requests
import { AuthContext } from '../../AuthContext'; // Importing AuthContext for user authentication details
import { 
  Container, Box, Typography, TextField, Button, Card, CardContent, 
  CircularProgress, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material'; // Importing Material-UI components
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importing theme creation functions from Material-UI
import { styled } from '@mui/system'; // Importing styled function for custom styling








// Creating a custom theme using Material-UI's createTheme function
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Main color for primary elements
    },
    secondary: {
      main: '#50E3C2', // Main color for secondary elements
    },
    background: {
      default: '#f7f9fc', // Default background color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Setting default font family
    h4: {
      fontWeight: 800, // Bold font weight for h4 headers
      color: '#333', // Color for h4 headers
      fontSize: '2rem', // Font size for h4 headers
    },
    h5: {
      fontWeight: 700, // Bold font weight for h5 headers
      color: '#555', // Color for h5 headers
      fontSize: '1.5rem', // Font size for h5 headers
    },
    body2: {
      color: '#777', // Color for body2 text
      fontSize: '1rem', // Font size for body2 text
    },
    button: {
      textTransform: 'uppercase', // Transform button text to uppercase
      fontWeight: 700, // Bold font weight for buttons
      fontSize: '0.875rem', // Font size for buttons
    },
  },
});









// Creating a styled component for Card using styled function from @mui/system
const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Adding transition effects
  '&:hover': {
    transform: 'scale(1.05)', // Scale up the card on hover
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', // Adding box shadow on hover
  },
  borderRadius: '15px', // Rounding the corners of the card
  overflow: 'hidden', // Ensuring content doesn't overflow
  position: 'relative', // Setting position to relative
  backgroundColor: '#fff', // Setting background color to white
  backgroundImage: 'linear-gradient(135deg, #fff 30%, #f3e5f5 90%)', // Adding a background gradient
});








// Creating a styled component for Button using styled function from @mui/system
const StyledButton = styled(Button)({
  backgroundColor: '#4A90E2', // Setting background color for the button
  color: '#fff', // Setting text color to white
  '&:hover': {
    backgroundColor: '#357ABD', // Changing background color on hover
  },
  padding: '10px 20px', // Adding padding to the button
  fontSize: '14px', // Setting font size for the button
  borderRadius: '30px', // Rounding the corners of the button
  transition: 'background-color 0.3s ease-in-out', // Adding transition effect to background color
});







// Array of university names for the dropdown selection
const universities = [
  "Université de Tunis", "Université de Carthage", "Université de Sfax", 
  "Université de Sousse", "Université de Monastir", "Université de Jendouba", 
  "Université de Gafsa", "Université de Gabès", "Université Virtuelle de Tunis", 
  "Université de Kairouan", "Université de La Manouba", "Université Centrale", 
  "Université Libre de Tunis (ULT)", "Université Tunis Carthage (UTC)", 
  "Université Centrale Privée des Sciences et Technologies de la Santé (UCST)", 
  "Institut Supérieur Privé des Technologies de l'Informatique et de Management (ITIM)", 
  "Université Internationale de Tunis (UIT)", "Université Paris-Dauphine Tunis", 
  "Université Privée de Tunis (UPT)", "École Supérieure Privée d'Ingénierie et de Technologies (ESPRIT)", 
  "Institut Supérieur Privé de Gestion de Tunis (ISG Tunis)", 
  "Institut Supérieur Privé des Sciences de la Santé de Tunis (ISSST)", 
  "Université Tunis El Manar", "Université Arabe des Sciences (UAS)", 
  "Institut Supérieur Privé d’Administration des Entreprises (ISPAE)", 
  "Institut Supérieur Privé de Gestion de Sousse (ISG Sousse)", 
  "Université des Sciences de l'Informatique et de Management (USIM)", 
  "Université Ibn Khaldoun", "Institut Supérieur Privé des Technologies de l'Information et de la Communication (SUPTECH)", 
  "Université des Sciences et Technologies de Tunis (USTT)", 
  "Université Libre des Sciences et Technologies (ULST)", 
  "Université des Sciences Économiques et de Gestion (USEG)", 
  "Institut Supérieur Privé des Sciences et Techniques de Sousse (ISSTS)", 
  "Institut Supérieur Privé des Technologies d'Informatique et de Management de Sfax (ISTIMS)", 
  "École Supérieure Privée de Génie Civil et de Technologie (ESGCT)", 
  "Institut Privé de Haute Études de Carthage (IHEC Carthage)", 
  "Institut Supérieur Privé d'Études Paramédicales de Tunis (ISPET)", 
  "Institut Supérieur Privé des Sciences et Technologies Appliquées de Sfax (ISSTAS)", 
  "Institut Supérieur Privé des Sciences de la Santé de Sousse (ISSOS)", 
  "Université Centrale Privée des Sciences Juridiques et Politiques (UCJSP)", 
  "Université des Sciences de l'Informatique et de Communication (USIC)", 
  "Université des Sciences et Technologies de Gafsa (USTG)", 
  "Institut Supérieur Privé des Sciences et Technologies de Monastir (ISSTM)", 
  "Université des Sciences Appliquées et de Management (USAM)", 
  "Université des Sciences et Technologies de Kairouan (USTK)", 
  "Université des Sciences de la Santé de Tunis (USST)", 
  "Institut Supérieur Privé de Gestion de Bizerte (ISGB)", 
  "Université Privée des Sciences de l'Informatique de Nabeul (USIN)", 
  "Université Centrale Privée des Sciences et Technologies de Gabès (UCSTG)", 
  "Institut Supérieur Privé de Management de Gafsa (ISMG)", 
  "Université des Sciences et Technologies Appliquées de Jendouba (USTAJ)", 
  "Université des Sciences et Technologies de Mahdia (USTM)", 
  "Institut Supérieur Privé de Gestion et de Technologies de Bizerte (ISGTB)", 
  "Université des Sciences Appliquées et de Technologies de Médenine (USATM)", 
  "Institut Supérieur Privé de Gestion de Nabeul (ISGN)", 
  "Université Centrale Privée des Sciences Appliquées de Sousse (UCPAS)", 
  "Université des Sciences de l'Informatique et de Management de Kébili (USIMK)", 
  "Université des Sciences et Technologies Appliquées de Siliana (USTAS)", 
  "Institut Supérieur Privé de Gestion et de Technologies de Kairouan (ISGTK)", 
  "Université des Sciences Appliquées et de Technologies de Kébili (USATK)", 
  "Institut Supérieur Privé de Gestion de Sidi Bouzid (ISGSB)"
];





// Main functional component for displaying job application form
const JobApplicationForm = () => {
  const { id } = useParams(); // Job ID from URL parameters
  const { userDetails, authToken } = useContext(AuthContext); // User details from context








  // State to store application form data
  const [application, setApplication] = useState({
    name: userDetails ? userDetails.fullName : '', // Setting default name from user details if available
    email: userDetails ? userDetails.email : '', // Setting default email from user details if available
    phone: userDetails ? userDetails.phoneNumber : '', // Setting default phone number from user details if available
    educationLevel: '', // Initial state for education level
    experienceLevel: '', // Initial state for experience level
    university: '', // Initial state for university
    motivationLetter: '', // Initial state for motivation letter
    resume: null, // Initial state for resume file
  });
  const [jobDetails, setJobDetails] = useState(null); // State to store job details








  // useEffect hook to fetch job details when the component mounts
  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(response => {
        setJobDetails(response.data); // Setting job details data
      })
      .catch(error => {
        console.error('Error fetching job details:', error); // Logging any errors
        alert('Failed to fetch job details.'); // Showing an alert in case of error
      });
  }, [id]); // Dependency array containing the job ID









  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplication(prev => ({ ...prev, resume: files[0] })); // Handling file input for resume
    } else {
      setApplication(prev => ({ ...prev, [name]: value })); // Handling text inputs
    }
  };









  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(); // Creating FormData object to send file and text data
    Object.keys(application).forEach(key => {
      if (key === 'resume' && application[key]) {
        formData.append('resume', application[key]); // Adding resume file to form data
      } else {
        formData.append(key, application[key]); // Adding other form data
      }
    });
    formData.append('jobId', id); // Adding job ID to form data

    axios.post('http://localhost:5000/api/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Setting content type for multipart/form-data
        Authorization: `Bearer ${authToken}` // Adding authorization header
      }
    })
    .then(response => {
      alert('Application submitted successfully!'); // Alert on successful submission
      console.log(response.data); // Logging response data
    })
    .catch(error => {
      console.error('Submission error:', error); // Logging any errors
      alert('Failed to submit application. Please try again.'); // Alert on submission failure
    });
  };

  console.log('User details:', userDetails); // Debug log for user details











  
  return (
    // Wrapping the component with ThemeProvider to apply the custom theme
    <ThemeProvider theme={theme}>
      {/* Main container with background gradient and padding */}
      <Box sx={{ background: 'linear-gradient(135deg, #4400E7 30%, #B71A89 90%)', py: 6, minHeight: '100vh' }}>
        <Container maxWidth="md">
          {/* Styled card to display job application form */}
          <StyledCard raised>
            <CardContent>
              {/* Heading for the job application form */}
              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: 'center', // Center aligning the text
                  marginBottom: '20px', // Adding bottom margin
                  fontWeight: 'bold', // Making the text bold
                  color: theme.palette.primary.main, // Setting text color
                }}
              >
                Apply for the Job
              </Typography>
              {/* Conditional rendering based on jobDetails state */}
              {jobDetails ? (
                // Displaying job details
                <Box sx={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '5px' }}>
                  <Typography variant="h5">{jobDetails.title}</Typography>
                  <Typography variant="body2"><strong>Category:</strong> {jobDetails.category}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {jobDetails.jobLocation}</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {jobDetails.jobType}</Typography>
                  <Typography variant="body2"><strong>Description:</strong> {jobDetails.description}</Typography>
                  <Typography variant="body2"><strong>Requirements:</strong> {jobDetails.requirements.join(', ')}</Typography>
                  <Typography variant="body2"><strong>Experience Required:</strong> {jobDetails.experienceLevel}</Typography>
                  <Typography variant="body2"><strong>Degree Required:</strong> {jobDetails.minimumDegree}</Typography>
                </Box>
              ) : (
                // Displaying a loading spinner while job details are being fetched
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              )}
              {/* Conditional rendering based on userDetails state */}
              {userDetails ? (
                // Displaying the job application form
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <TextField 
                    type="text" 
                    name="name" 
                    value={application.name} 
                    onChange={handleChange} 
                    label="Your Name" 
                    required 
                    fullWidth 
                  />
                  <TextField 
                    type="email" 
                    name="email" 
                    value={application.email} 
                    onChange={handleChange} 
                    label="Your Email" 
                    required 
                    fullWidth 
                  />
                  <TextField 
                    type="text" 
                    name="phone" 
                    value={application.phone} 
                    onChange={handleChange} 
                    label="Your Phone Number" 
                    required 
                    fullWidth 
                  />
                  <TextField
                    select
                    name="educationLevel"
                    value={application.educationLevel}
                    onChange={handleChange}
                    label="Obtained Degree"
                    required
                    fullWidth
                  >
                    <MenuItem value="">Select Obtained Degree</MenuItem>
                    <MenuItem value="Licence">Licence</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Baccalaureate">Baccalaureate</MenuItem>
                  </TextField>
                  <TextField
                    select
                    name="experienceLevel"
                    value={application.experienceLevel}
                    onChange={handleChange}
                    label="Experience Level"
                    required
                    fullWidth
                  >
                    <MenuItem value="">Select Experience Level</MenuItem>
                    <MenuItem value="0 years">0 years</MenuItem>
                    <MenuItem value="1-3 years">1-3 years</MenuItem>
                    <MenuItem value="4-6 years">4-6 years</MenuItem>
                    <MenuItem value="7+ years">7+ years</MenuItem>
                  </TextField>
                  <FormControl fullWidth required sx={{ marginBottom: '10px' }}>
                    <InputLabel>University</InputLabel>
                    <Select 
                      name="university" 
                      value={application.university} 
                      onChange={handleChange} 
                      label="University"
                    >
                      {universities.map((university, index) => (
                        <MenuItem key={index} value={university}>{university}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    multiline
                    rows={4}
                    name="motivationLetter"
                    value={application.motivationLetter}
                    onChange={handleChange}
                    label="Your Motivation Letter"
                    required
                    fullWidth
                  />
                  <TextField 
                    type="file" 
                    name="resume" 
                    onChange={handleChange} 
                    accept="application/pdf" 
                    required 
                    fullWidth 
                  />
                  <StyledButton type="submit" fullWidth>Submit Application</StyledButton>
                </form>
              ) : (
                // Prompting user to register if not authenticated
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="h6" gutterBottom>Register to apply</Typography>
                  <Button variant="contained" color="primary" component={Link} to="/register">Register</Button>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default JobApplicationForm; // Exporting the component to be used in other parts of the app
