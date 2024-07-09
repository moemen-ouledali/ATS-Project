import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Box, Typography, Container, Card, CardContent, CardActions, Grid, Button as MuiButton, CircularProgress, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

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

const calculateMatchPercentage = (requirements, resumeText) => {
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matchedRequirements = requirements.filter(requirement =>
    resumeWords.includes(requirement.toLowerCase())
  );
  const percentage = (matchedRequirements.length / requirements.length) * 100;
  return percentage;
};

const getMatchedUnmatchedRequirements = (requirements, resumeText) => {
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matched = [];
  const unmatched = [];
  requirements.forEach(requirement => {
    if (resumeWords.includes(requirement.toLowerCase())) {
      matched.push(requirement);
    } else {
      unmatched.push(requirement);
    }
  });
  return { matched, unmatched };
};

const JobApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();

  const fetchApplicants = useCallback(async () => {
    try {
      const [applicantsResponse, jobResponse] = await Promise.all([
        axios.get(`https://ats-project-1.onrender.com/api/applications/for-job/${jobId}`),
        axios.get(`https://ats-project-1.onrender.com/api/jobs/${jobId}`)
      ]);

      setApplicants(applicantsResponse.data);
      setJobDetails(jobResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch applicants or job details:', error);
      setError('Failed to fetch applicants or job details');
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const acceptApplication = async (appId) => {
    try {
      await axios.put(`https://ats-project-1.onrender.com/api/applications/accept/${appId}`);
      fetchApplicants();
    } catch (error) {
      console.error('Failed to accept application:', error);
    }
  };

  const declineApplication = async (appId) => {
    try {
      await axios.put(`https://ats-project-1.onrender.com/api/applications/decline/${appId}`);
      fetchApplicants();
    } catch (error) {
      console.error('Failed to decline application:', error);
    }
  };

  const showApplicationDetails = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const closeApplicationDetails = () => {
    setSelectedApplicant(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(135deg, #F5F5F5 30%, #E0E0E0 90%)', py: 6, minHeight: '100vh' }}>
        <Container component={Paper} elevation={3} sx={{ p: 6, borderRadius: 3, background: 'white' }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', color: theme.palette.primary.main }}>
            Applicants for {jobDetails?.title}
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            applicants.length === 0 ? (
              <Typography>No applicants for {jobDetails?.title} at the current time.</Typography>
            ) : (
              <Grid container spacing={4}>
                {applicants.map(applicant => {
                  const matchPercentage = calculateMatchPercentage(jobDetails.requirements, applicant.resumeText);
                  return (
                    <Grid item xs={12} key={applicant._id}>
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h5" component="h2">{applicant.name}</Typography>
                          <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {applicant.educationLevel}</Typography>
                          <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {applicant.experienceLevel}</Typography>
                          <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {applicant.status || 'In Review'}</Typography>
                          <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(applicant.createdAt).toLocaleDateString()} {new Date(applicant.createdAt).toLocaleTimeString()}</Typography>
                          <Typography variant="body2" color="textSecondary" component="p"><strong>Match Percentage:</strong> {matchPercentage.toFixed(0)}%</Typography>
                        </CardContent>
                        <CardActions>
                          <AcceptButton onClick={() => acceptApplication(applicant._id)}>Accept</AcceptButton>
                          <DeclineButton onClick={() => declineApplication(applicant._id)}>Decline</DeclineButton>
                          <ViewButton onClick={() => showApplicationDetails(applicant)}>View Details</ViewButton>
                        </CardActions>
                      </StyledCard>
                    </Grid>
                  );
                })}
              </Grid>
            )
          )}
          {selectedApplicant && (
            <Modal show onHide={closeApplicationDetails}>
              <Modal.Header closeButton>
                <Modal.Title>Application Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Typography variant="h6" component="p"><strong>Name:</strong> {selectedApplicant.name}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Email:</strong> {selectedApplicant.email}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Phone:</strong> {selectedApplicant.phone}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {selectedApplicant.educationLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {selectedApplicant.experienceLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>University:</strong> {selectedApplicant.university}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Motivation Letter:</strong> {selectedApplicant.motivationLetter}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Resume:</strong> <a href={`https://ats-project-1.onrender.com/${selectedApplicant.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {selectedApplicant.status}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(selectedApplicant.createdAt).toLocaleDateString()} {new Date(selectedApplicant.createdAt).toLocaleTimeString()}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Match Percentage:</strong> {calculateMatchPercentage(jobDetails.requirements, selectedApplicant.resumeText)}%</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Matched Requirements:</strong></Typography>
                <ul>
                  {getMatchedUnmatchedRequirements(jobDetails.requirements, selectedApplicant.resumeText).matched.map((req, index) => (
                    <li key={index} style={{ color: 'green' }}>{req}</li>
                  ))}
                </ul>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Unmatched Requirements:</strong></Typography>
                <ul>
                  {getMatchedUnmatchedRequirements(jobDetails.requirements, selectedApplicant.resumeText).unmatched.map((req, index) => (
                    <li key={index} style={{ color: 'red' }}>{req}</li>
                  ))}
                </ul>
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

export default JobApplicants;
