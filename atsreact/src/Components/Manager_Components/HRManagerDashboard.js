// HRManagerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListingModal from './AddJobListingModal';
import EditJobListing from './EditJobListing';
import ToastNotification from '../Extra_Components/ToastNotification';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Modal,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  CardActionArea,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Assessment } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Matches the blue button
    },
    secondary: {
      main: '#E91E63', // Matches the pink header tag
    },
    background: {
      default: '#F5F5F5', // Neutral light background
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Matches the landing page font
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

const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
  },
  borderRadius: '15px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#fff',
  backgroundImage: 'linear-gradient(135deg, #fff 30%, #E3F2FD 90%)', // Light blue gradient
});

const StyledButton = styled(Button)({
  backgroundColor: '#4A90E2', // Matches the primary blue color
  color: '#fff',
  '&:hover': {
    backgroundColor: '#357ABD',
  },
  padding: '10px 20px',
  fontSize: '14px',
  borderRadius: '30px',
  transition: 'background-color 0.3s ease-in-out',
});

const GradientText = styled('span')({
  background: 'linear-gradient(45deg, #4A90E2, #E91E63)', // Blue to pink gradient
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const HRManagerDashboard = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showJobListings, setShowJobListings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showJobListings) {
      fetchJobListings();
    }
  }, [showJobListings]);

  const fetchJobListings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobListings(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch job listings:', error);
      setError('Failed to fetch job listings');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteJobListing = (id) => {
    setDeleteJobId(id);
    setShowDeleteModal(true);
  };

  const deleteJobListing = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${deleteJobId}`);
      fetchJobListings();
      setToastMessage('Job listing deleted successfully');
      setShowToast(true);
      setShowDeleteModal(false);
      setDeleteJobId(null);
    } catch (error) {
      console.error('Failed to delete job listing:', error);
      setToastMessage('Failed to delete job listing');
      setShowToast(true);
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id, updatedListing) => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, updatedListing);
      fetchJobListings();
      setEditingId(null);
      setToastMessage('Job listing updated successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to update job listing:', error);
      setToastMessage('Failed to update job listing');
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const showApplicants = (jobId) => {
    navigate(`/job-applicants/${jobId}`);
  };

  const showAllApplications = () => {
    navigate('/all-applications');
  };

  const showTestAttempts = () => {
    navigate('/manager-test-attempts');
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(135deg, #F5F5F5 30%, #E0E0E0 90%)', py: 6, minHeight: '100vh' }}>
        <Container component={Paper} elevation={3} sx={{ p: 6, borderRadius: 3, background: 'white' }}>
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              marginBottom: '40px',
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            <GradientText>Welcome HR Manager</GradientText>
          </Typography>
          <Box sx={{ mb: 4, display: 'flex', gap: 3 }}>
            <StyledButton
              variant="contained"
              startIcon={<Visibility />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={showAllApplications}
            >
              Show All Applications
            </StyledButton>
            <StyledButton
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={handleShowModal}
            >
              Add Job Listing
            </StyledButton>
            <StyledButton
              variant="contained"
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={() => setShowJobListings(true)}
            >
              Manage Job Listings
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<Assessment />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={showTestAttempts}
            >
              View Test Attempts
            </StyledButton>
          </Box>
          <AddJobListingModal
            show={showModal}
            handleClose={handleCloseModal}
            fetchJobListings={fetchJobListings}
          />

          {showJobListings && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Grid container spacing={4}>
                  {jobListings.map((listing) => (
                    <Grid item xs={12} md={6} lg={4} key={listing._id}>
                      <StyledCard raised>
                        <CardActionArea>
                          <CardContent>
                            {editingId === listing._id ? (
                              <EditJobListing
                                listing={listing}
                                onSave={handleSave}
                                onCancel={handleCancel}
                              />
                            ) : (
                              <>
                                <Typography variant="h5" component="h2">
                                  {listing.title} - {listing.category}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  <strong>Location:</strong> {listing.jobLocation}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  <strong>Type:</strong> {listing.jobType}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  <strong>Description:</strong> {listing.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  <strong>Requirements:</strong> {listing.requirements}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  <strong>Experience Level:</strong> {listing.experienceLevel}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  <strong>Minimum Degree:</strong> {listing.minimumDegree}
                                </Typography>
                              </>
                            )}
                          </CardContent>
                        </CardActionArea>
                        <CardActions sx={{ justifyContent: 'center' }}>
                          <StyledButton
                            size="large"
                            startIcon={<Edit />}
                            onClick={() => handleEditClick(listing._id)}
                          >
                            Edit
                          </StyledButton>
                          <StyledButton
                            size="large"
                            startIcon={<Delete />}
                            onClick={() => confirmDeleteJobListing(listing._id)}
                          >
                            Delete
                          </StyledButton>
                          <StyledButton
                            size="large"
                            startIcon={<Visibility />}
                            onClick={() => showApplicants(listing._id)}
                          >
                            Show Applicants
                          </StyledButton>
                        </CardActions>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
          {showToast && (
            <ToastNotification
              message={toastMessage}
              onClose={() => setShowToast(false)}
            />
          )}

          <Modal
            open={showDeleteModal}
            onClose={handleCloseDeleteModal}
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
              }}
            >
              <Typography id="delete-confirmation-title" variant="h5" component="h2">
                Confirm Deletion
              </Typography>
              <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
                Are you sure you want to delete this job listing?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleCloseDeleteModal}>
                  Cancel
                </Button>
                <Button variant="contained" color="secondary" onClick={deleteJobListing}>
                  Delete
                </Button>
              </Box>
            </Box>
          </Modal>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HRManagerDashboard;
