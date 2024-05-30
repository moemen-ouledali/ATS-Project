import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box } from '@mui/material';
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
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');

  useEffect(() => {
    const fetchTestAttempts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tests/all-attempts');
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
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleAcceptApplication = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applications/accept-after-test/${selectedApplication.application._id}`,
        { date: interviewDate, time: interviewTime }
      );
      setAttempts(attempts.map(attempt =>
        attempt.application._id === selectedApplication.application._id
          ? { ...attempt, application: response.data }
          : attempt
      ));
      setOpenAcceptDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to accept application:', error);
    }
  };

  const handleDeclineApplication = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/applications/decline-after-test/${selectedApplication.application._id}`);
      setAttempts(attempts.map(attempt =>
        attempt.application._id === selectedApplication.application._id
          ? { ...attempt, application: response.data }
          : attempt
      ));
      setOpenDeclineDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to decline application:', error);
    }
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
              {attempts.map((attempt) => (
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
                    <Button variant="contained" color="secondary" onClick={() => { setOpenAcceptDialog(true); setSelectedApplication(attempt); }}>
                      Accept
                    </Button>
                    <Button variant="contained" color="error" onClick={() => { setOpenDeclineDialog(true); setSelectedApplication(attempt); }}>
                      Decline
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Accept Dialog */}
      <Dialog open={openAcceptDialog} onClose={() => setOpenAcceptDialog(false)}>
        <DialogTitle>Accept Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the interview date and time.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Interview Date"
            type="date"
            fullWidth
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Interview Time"
            type="time"
            fullWidth
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAcceptDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAcceptApplication} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={openDeclineDialog} onClose={() => setOpenDeclineDialog(false)}>
        <DialogTitle>Decline Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to decline this application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeclineDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeclineApplication} color="primary">
            Decline
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagerTestAttempts;
