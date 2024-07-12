import React, { useState, useEffect, useContext, useCallback } from 'react'; // Importing React and necessary hooks
import axios from 'axios'; // Importing axios for HTTP requests
import { AuthContext } from '../../AuthContext'; // Importing the AuthContext
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import { 
  Container, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CircularProgress, 
  Modal 
} from '@mui/material'; // Importing Material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importing theme creation and ThemeProvider from Material UI











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a custom theme for Material UI components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Primary color
    },
    secondary: {
      main: '#50E3C2', // Secondary color
    },
    background: {
      default: '#f7f9fc', // Background color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Font family
    h4: {
      fontWeight: 800,
      color: '#333',
      fontSize: '2rem', // Header 4 style
    },
    h5: {
      fontWeight: 700,
      color: '#555',
      fontSize: '1.5rem', // Header 5 style
    },
    body2: {
      color: '#777',
      fontSize: '1rem', // Body text style
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
      fontSize: '0.875rem', // Button text style
    },
  },
});









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the main component for the Candidate Dashboard
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]); // State to store applications
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to handle errors
  const [selectedApplication, setSelectedApplication] = useState(null); // State to handle the selected application for the modal
  const { authToken, userDetails } = useContext(AuthContext); // Get auth token and user details from context
  const navigate = useNavigate(); // Get the navigate function for programmatic navigation













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch applications from the API
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchApplications = useCallback(async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.get('http://localhost:5000/api/applications', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add authorization header
        },
        params: {
          email: userDetails.email, // Add email as query parameter
        },
      });

      setApplications(response.data); // Set the fetched applications to state
      setLoading(false); // Set loading state to false
    } catch (err) {
      setError('Failed to fetch applications'); // Set error message
      setLoading(false); // Set loading state to false
      console.error(err); // Log the error
    }
  }, [authToken, userDetails.email]);







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch applications when the component mounts
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchApplications(); // Fetch applications
  }, [fetchApplications]);








/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Show application details in a modal
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const showApplicationDetails = (application) => {
    setSelectedApplication(application); // Set the selected application for the modal
  };












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Close the application details modal
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const closeApplicationDetails = () => {
    setSelectedApplication(null); // Clear the selected application
  };











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Handle navigation to the evaluation test
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleEvaluationTest = (category, applicationId) => {
    navigate(`/test/${category}?applicationId=${applicationId}`); // Navigate to the evaluation test page
  };














  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render the component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <ThemeProvider theme={theme}> {/* Apply the custom theme */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Your Applications
        </Typography>
        {loading ? ( // Show loading spinner if loading
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? ( // Show error message if there's an error
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : ( // Show applications table if data is fetched successfully
          applications.length === 0 ? (
            <Typography variant="h6" align="center">
              No applications found.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 3 }}>
              <Table sx={{ minWidth: 650 }} aria-label="applications table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Job</strong></TableCell>
                    <TableCell><strong>Date Applied</strong></TableCell>
                    <TableCell><strong>Education Level</strong></TableCell>
                    <TableCell><strong>Experience Level</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => ( // Loop through applications and render table rows
                    <TableRow key={app._id}>
                      <TableCell>{app.jobId ? app.jobId.title : 'No job title available'}</TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString()}</TableCell>
                      <TableCell>{app.educationLevel}</TableCell>
                      <TableCell>{app.experienceLevel}</TableCell>
                      <TableCell>{app.status}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="primary" onClick={() => showApplicationDetails(app)} sx={{ mr: 1 }}>
                          View Details
                        </Button>
                        {app.status === 'Accepted' && app.jobId && ( // Show evaluation test button if the application is accepted
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleEvaluationTest(app.jobId.category, app._id)}
                          >
                            Evaluation Test
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
        <Modal open={!!selectedApplication} onClose={closeApplicationDetails}> {/* Modal for application details */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}>
            {selectedApplication && (
              <>
                <Typography variant="h6" component="h2" gutterBottom>
                  Application Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {selectedApplication.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedApplication.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {selectedApplication.phone}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Education Level:</strong> {selectedApplication.educationLevel}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Experience Level:</strong> {selectedApplication.experienceLevel}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>University:</strong> {selectedApplication.university}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Motivation Letter:</strong> {selectedApplication.motivationLetter}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Resume:</strong> <a href={`http://localhost:5000/${selectedApplication.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong> {selectedApplication.status}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={closeApplicationDetails}>
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default CandidateDashboard; // Export the component as default
