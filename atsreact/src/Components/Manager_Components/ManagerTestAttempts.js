import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Modal as BootstrapModal, Button as BootstrapButton } from 'react-bootstrap';

const calculateMatchPercentage = (requirements = [], resumeText = '') => {
  if (!requirements.length || !resumeText) return 0;
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matchedRequirements = requirements.filter(requirement =>
    resumeWords.includes(requirement.toLowerCase())
  );
  const percentage = (matchedRequirements.length / requirements.length) * 100;
  return percentage;
};

const getMatchedUnmatchedRequirements = (requirements = [], resumeText = '') => {
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

const ManagerTestAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchTestAttempts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tests/all-attempts');
        console.log('API Response:', response.data); // Debugging line
        setAttempts(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch attempts:', error);
        setError('Failed to fetch attempts');
      } finally {
        setLoading(false);
      }
    };

    fetchTestAttempts();
  }, []);

  const handleViewApplication = (application) => {
    console.log('Selected Application:', application);
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Attempts
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Test Category</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Application Status</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts.map((attempt) => {
                console.log('Attempt:', attempt); // Debugging line
                return (
                  <TableRow key={attempt._id}>
                    <TableCell>
                      {attempt.user ? `${attempt.user.firstName} ${attempt.user.lastName}` : 'N/A'}
                    </TableCell>
                    <TableCell>{attempt.test ? attempt.test.category : 'N/A'}</TableCell>
                    <TableCell>{attempt.score}</TableCell>
                    <TableCell>{attempt.application ? attempt.application.status : 'N/A'}</TableCell>
                    <TableCell>{attempt.jobTitle}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleViewApplication(attempt)}>
                        View Application
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedApplication && (
        <BootstrapModal show onHide={handleCloseModal}>
          <BootstrapModal.Header closeButton>
            <BootstrapModal.Title>Application Details</BootstrapModal.Title>
          </BootstrapModal.Header>
          <BootstrapModal.Body>
            <Typography variant="h6" component="p"><strong>Name:</strong> {selectedApplication.application.name}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Email:</strong> {selectedApplication.application.email}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Phone:</strong> {selectedApplication.application.phone}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {selectedApplication.application.educationLevel}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {selectedApplication.application.experienceLevel}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>University:</strong> {selectedApplication.application.university}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Motivation Letter:</strong> {selectedApplication.application.motivationLetter}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Resume:</strong> <a href={`http://localhost:5000/${selectedApplication.application.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {selectedApplication.application.status}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(selectedApplication.application.createdAt).toLocaleDateString()} {new Date(selectedApplication.application.createdAt).toLocaleTimeString()}</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Match Percentage:</strong> {calculateMatchPercentage(selectedApplication.jobRequirements || [], selectedApplication.application.resumeText || '')}%</Typography>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Matched Requirements:</strong></Typography>
            <ul>
              {getMatchedUnmatchedRequirements(selectedApplication.jobRequirements || [], selectedApplication.application.resumeText || '').matched.map((req, index) => (
                <li key={index} style={{ color: 'green' }}>{req}</li>
              ))}
            </ul>
            <Typography variant="body2" color="textSecondary" component="p"><strong>Unmatched Requirements:</strong></Typography>
            <ul>
              {getMatchedUnmatchedRequirements(selectedApplication.jobRequirements || [], selectedApplication.application.resumeText || '').unmatched.map((req, index) => (
                <li key={index} style={{ color: 'red' }}>{req}</li>
              ))}
            </ul>
          </BootstrapModal.Body>
          <BootstrapModal.Footer>
            <BootstrapButton variant="secondary" onClick={handleCloseModal}>Close</BootstrapButton>
          </BootstrapModal.Footer>
        </BootstrapModal>
      )}
    </Container>
  );
};

export default ManagerTestAttempts;
