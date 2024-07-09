import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Typography, Modal, Box, Button, CircularProgress, Grid, Divider } from '@mui/material';
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
    display: 'flex',
    justifyContent: 'space-between',
  },
  '.rbc-toolbar button': {
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  '.rbc-toolbar button:hover': {
    backgroundColor: '#0056b3',
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
  '.rbc-month-view': {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
});

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Increased width to 90%
  maxWidth: '1200px', // Increased max-width to 1200px
  backgroundColor: '#fff',
  border: 'none',
  boxShadow: 24,
  padding: '20px', // Added padding
  borderRadius: '10px',
});

const CustomButton = styled(Button)({
  borderRadius: '20px',
  padding: '10px 20px',
  fontWeight: 'bold',
  textTransform: 'none',
});

const HeaderTypography = styled(Typography)({
  fontWeight: 'bold',
  color: '#007BFF',
  marginBottom: '20px',
});

const InfoTypography = styled(Typography)({
  marginBottom: '10px',
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
        const response = await axios.get('https://ats-project-1.onrender.com/api/interviews');
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
    const applicationId = interview.applicationId._id || interview.applicationId; // Ensure applicationId is a string
    console.log(`Fetching details for applicationId: ${applicationId}`);
    try {
      const response = await axios.get(`https://ats-project-1.onrender.com/api/applications/${applicationId}`);
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
    const applicationId = selectedInterview.applicationId._id || selectedInterview.applicationId; // Ensure applicationId is a string
    try {
      await axios.put(`https://ats-project-1.onrender.com/api/applications/${applicationId}/status`, { status });
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
      <HeaderTypography variant="h3" gutterBottom align="center">
        Interview Calendar
      </HeaderTypography>
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoTypography variant="h6"><strong>Name:</strong> {applicationDetails.name}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Email:</strong> {applicationDetails.email}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Phone:</strong> {applicationDetails.phone}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Education Level:</strong> {applicationDetails.educationLevel}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Experience Level:</strong> {applicationDetails.experienceLevel}</InfoTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoTypography variant="body1"><strong>University:</strong> {applicationDetails.university}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Motivation Letter:</strong> {applicationDetails.motivationLetter}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Resume:</strong> <a href={`https://ats-project-1.onrender.com/${applicationDetails.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></InfoTypography>
                  <InfoTypography variant="body1"><strong>Status:</strong> {applicationDetails.status}</InfoTypography>
                  <InfoTypography variant="body1"><strong>Applied on:</strong> {new Date(applicationDetails.createdAt).toLocaleDateString()} {new Date(applicationDetails.createdAt).toLocaleTimeString()}</InfoTypography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <CustomButton variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => handleUpdateStatus('accepted after interview')}>
                  Accept After Interview
                </CustomButton>
                <CustomButton variant="contained" color="error" onClick={() => handleUpdateStatus('declined after interview')}>
                  Decline After Interview
                </CustomButton>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          )}
        </ModalBox>
      </Modal>
    </Container>
  );
};

export default InterviewCalendar;
