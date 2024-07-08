import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Context for authentication
import { useNavigate } from 'react-router-dom'; // Navigation hook
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
  Modal,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';








// Define the theme for the application
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#50E3C2',
    },
    background: {
      default: '#f7f9fc',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h4: {
      fontWeight: 800,
      color: '#333',
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 700,
      color: '#555',
      fontSize: '1.5rem',
    },
    body2: {
      color: '#777',
      fontSize: '1rem',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
      fontSize: '0.875rem',
    },
  },
});










const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]); // State to store applications
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors
  const [selectedApplication, setSelectedApplication] = useState(null); // State to handle selected application
  const { authToken, userDetails } = useContext(AuthContext); // Get authToken and userDetails from AuthContext
  const navigate = useNavigate(); // Hook for navigation





  // Function to fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get('http://localhost:5000/api/applications', {
        headers: {
          Authorization: `Bearer ${authToken}`, // Set authorization header
        },
        params: {
          email: userDetails.email, // Set email parameter
        },
      });

      setApplications(response.data); // Set applications data
      setLoading(false); // Set loading to false
    } catch (err) {
      setError('Failed to fetch applications'); // Set error message
      setLoading(false); // Set loading to false
      console.error(err); // Log error to console
    }
  }, [authToken, userDetails.email]); // Dependencies for useCallback








  // useEffect to fetch applications on component mount
  useEffect(() => {
    fetchApplications(); // Call fetchApplications function
  }, [fetchApplications]); // Dependencies for useEffect






  // Function to show application details
  const showApplicationDetails = (application) => {
    setSelectedApplication(application); // Set selected application
  };





  // Function to close application details
  const closeApplicationDetails = () => {
    setSelectedApplication(null); // Clear selected application
  };






  // Function to handle evaluation test
  const handleEvaluationTest = (category, applicationId) => {
    navigate(`/test/${category}?applicationId=${applicationId}`); // Navigate to evaluation test page
  };









  

  return (
    <ThemeProvider theme={theme}> {/* Provide theme to the component */}
      <Container sx={{ py: 6 }}> {/* Container with padding */}
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Your Applications
        </Typography>
        {loading ? ( // Show loading spinner if loading is true
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? ( // Show error message if there is an error
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          applications.length === 0 ? ( // Show message if there are no applications
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
                  {applications.map((app) => (
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
                        {app.status === 'Accepted' && app.jobId && (
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
        <Modal open={!!selectedApplication} onClose={closeApplicationDetails}>
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

export default CandidateDashboard;
