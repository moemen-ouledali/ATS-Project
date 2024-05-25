// src/Components/Manager_Components/AllApplications.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Box, Typography, Container, Card, CardContent, CardActions, Grid, Button as MuiButton, CircularProgress, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { calculateMatchPercentage } from '../../utils'; // Import the utility function

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#E91E63',
    },
    background: {
      default: '#F5F5F5',
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
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.875rem',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  marginBottom: '20px',
  backgroundColor: '#fff',
  padding: '20px',
  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  transition: 'box-shadow 0.3s ease-in-out',
}));

const GradientButton = styled(MuiButton)(({ gradient }) => ({
  background: gradient,
  padding: '10px 20px',
  fontSize: '14px',
  borderRadius: '30px',
  marginRight: '10px',
  color: '#fff',
  transition: 'background 0.3s ease-in-out',
  '&:hover': {
    background: gradient,
    opacity: 0.9,
  },
}));

const AcceptButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
});

const DeclineButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #F44336, #E57373)',
});

const ViewButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #4A90E2, #357ABD)',
});

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applications/all');
        setApplications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setError('Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchAllApplications();
  }, []);

  const acceptApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/accept/${appId}`);
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: 'Accepted' } : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Failed to accept application:', error);
    }
  };

  const declineApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/decline/${appId}`);
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: 'Declined' } : app
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Failed to decline application:', error);
    }
  };

  const showApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicationDetails = () => {
    setSelectedApplication(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(135deg, #F5F5F5 30%, #E0E0E0 90%)', py: 6, minHeight: '100vh' }}>
        <Container component={Paper} elevation={3} sx={{ p: 6, borderRadius: 3, background: 'white' }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', color: theme.palette.primary.main }}>
            All Applications
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            applications.length === 0 ? (
              <Typography>No applications available at the current time.</Typography>
            ) : (
              <Grid container spacing={4}>
                {applications.map(app => (
                  <Grid item xs={12} key={app._id}>
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h5" component="h2">{app.name}</Typography>
                        <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {app.educationLevel}</Typography>
                        <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {app.experienceLevel}</Typography>
                        <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {app.status}</Typography>
                        <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()} {new Date(app.createdAt).toLocaleTimeString()}</Typography>
                        
                        {/* Add match percentage display */}
                        <Typography variant="body2" color="textSecondary" component="p">
                          <strong>Match Percentage:</strong> {`${calculateMatchPercentage(app.jobId.requirements, app.resumeText, app.motivationLetter)}%`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <AcceptButton onClick={() => acceptApplication(app._id)}>Accept</AcceptButton>
                        <DeclineButton onClick={() => declineApplication(app._id)}>Decline</DeclineButton>
                        <ViewButton onClick={() => showApplicationDetails(app)}>View Details</ViewButton>
                      </CardActions>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )
          )}
          {selectedApplication && (
            <Modal show onHide={closeApplicationDetails}>
              <Modal.Header closeButton>
                <Modal.Title>Application Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Typography variant="h6" component="p"><strong>Name:</strong> {selectedApplication.name}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Email:</strong> {selectedApplication.email}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Phone:</strong> {selectedApplication.phone}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {selectedApplication.educationLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {selectedApplication.experienceLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>University:</strong> {selectedApplication.university}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Motivation Letter:</strong> {selectedApplication.motivationLetter}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Resume:</strong> <a href={`http://localhost:5000/${selectedApplication.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {selectedApplication.status}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()} {new Date(selectedApplication.createdAt).toLocaleTimeString()}</Typography>
                
                {/* Add match percentage display */}
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Match Percentage:</strong> {`${calculateMatchPercentage(selectedApplication.requirements, selectedApplication.resumeText, selectedApplication.motivationLetter)}%`}
                </Typography>
              </Modal.Body>
              <Modal.Footer>
                <BootstrapButton variant="secondary" onClick={closeApplicationDetails}>Close</BootstrapButton>
              </Modal.Footer>
            </Modal>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AllApplications;
