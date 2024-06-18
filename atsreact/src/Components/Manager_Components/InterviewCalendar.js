import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Typography, Modal, Box, Button, CircularProgress, Paper } from '@mui/material';
import { styled } from '@mui/system';

const localizer = momentLocalizer(moment);

const StyledCalendar = styled(Calendar)({
  height: '700px',
  margin: '50px 0',
  '.rbc-toolbar': {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  '.rbc-event': {
    backgroundColor: '#ff6347',
    borderRadius: '5px',
    border: 'none',
    padding: '5px',
    color: '#fff',
  },
  '.rbc-today': {
    backgroundColor: '#eaf6ff',
  },
});

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  backgroundColor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
});

const InterviewCalendar = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/interviews');
        setInterviews(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching interviews: ' + error.message);
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleSelectEvent = async (interview) => {
    setSelectedInterview(interview);
    const applicationId = interview.applicationId.toString(); // Ensure applicationId is a string
    console.log(`Fetching details for applicationId: ${applicationId}`);
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/${applicationId}`);
      setApplicationDetails(response.data);
      setOpen(true);
    } catch (error) {
      alert('Error fetching application details: ' + error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInterview(null);
    setApplicationDetails(null);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedInterview) return;
    const applicationId = selectedInterview.applicationId.toString(); // Ensure applicationId is a string
    try {
      await axios.put(`http://localhost:5000/api/applications/${applicationId}/status`, { status });
      setInterviews(interviews.map(i => (i._id === selectedInterview._id ? { ...i, applicationStatus: status } : i)));
      handleClose();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const events = interviews.map(interview => ({
    title: `${interview.applicantName} - Interview`,
    start: new Date(interview.dateTime),
    end: new Date(new Date(interview.dateTime).getTime() + 60 * 60 * 1000), // 1 hour duration
    interview: interview
  }));

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#007BFF', my: 4 }}>
        Interview Calendar
      </Typography>
      <StyledCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={event => handleSelectEvent(event.interview)}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="application-details-title"
        aria-describedby="application-details-description"
      >
        <ModalBox>
          <Typography variant="h4" id="application-details-title" gutterBottom>
            Application Details
          </Typography>
          {applicationDetails ? (
            <>
              <Typography variant="h6"><strong>Name:</strong> {applicationDetails.name}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {applicationDetails.email}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {applicationDetails.phone}</Typography>
              <Typography variant="body1"><strong>Education Level:</strong> {applicationDetails.educationLevel}</Typography>
              <Typography variant="body1"><strong>Experience Level:</strong> {applicationDetails.experienceLevel}</Typography>
              <Typography variant="body1"><strong>University:</strong> {applicationDetails.university}</Typography>
              <Typography variant="body1"><strong>Motivation Letter:</strong> {applicationDetails.motivationLetter}</Typography>
              <Typography variant="body1"><strong>Resume:</strong> <a href={`http://localhost:5000/${applicationDetails.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
              <Typography variant="body1"><strong>Status:</strong> {applicationDetails.status}</Typography>
              <Typography variant="body1"><strong>Applied on:</strong> {new Date(applicationDetails.createdAt).toLocaleDateString()} {new Date(applicationDetails.createdAt).toLocaleTimeString()}</Typography>
              <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => handleUpdateStatus('accepted after interview')}>
                  Accept After Interview
                </Button>
                <Button variant="contained" color="error" onClick={() => handleUpdateStatus('declined after interview')}>
                  Decline After Interview
                </Button>
              </Box>
            </>
          ) : (
            <CircularProgress />
          )}
        </ModalBox>
      </Modal>
    </Container>
  );
};

export default InterviewCalendar;
