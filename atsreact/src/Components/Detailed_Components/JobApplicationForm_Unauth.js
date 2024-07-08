import React, { useState, useEffect } from 'react'; // Importing React hooks
import { useParams, Link } from 'react-router-dom'; // Importing necessary components from React Router
import axios from 'axios'; // Importing axios for making HTTP requests
import { 
  Container, Box, Typography, Card, CardContent, 
  CircularProgress, Button 
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







// Main functional component for displaying job application form
const JobApplicationFormUnauth = () => {
  const { id } = useParams(); // Job ID from URL parameters
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










  return (
    // Wrapping the component with ThemeProvider to apply the custom theme
    <ThemeProvider theme={theme}>
      {/* Main container with background gradient and padding */}
      <Box sx={{ background: 'linear-gradient(135deg, #4400E7 30%, #B71A89 90%)', py: 6, minHeight: '100vh' }}>
        <Container maxWidth="md">
          {/* Styled card to display job details */}
          <StyledCard raised>
            <CardContent>
              {/* Heading for the job details */}
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
                Job Details
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
              {/* Button to navigate to registration page */}
              <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">Register to Apply</Button>
                </Link>
              </Typography>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default JobApplicationFormUnauth; // Exporting the component to be used in other parts of the app
