// Import necessary dependencies and components
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, List, BarChart, CalendarToday } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';













// Create a theme using Material-UI's createTheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Main color
    },
    secondary: {
      main: '#E91E63', // Secondary color
    },
    background: {
      default: '#F5F5F5', // Background color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Font family
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






// Styled components for Card and Button
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
  backgroundImage: 'linear-gradient(135deg, #fff 30%, #E3F2FD 90%)',
});

const StyledButton = styled(Button)({
  backgroundColor: '#4A90E2',
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
  background: 'linear-gradient(45deg, #4A90E2, #E91E63)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});


















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main component: HRManagerDashboard
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const HRManagerDashboard = () => {
  // State variables
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();











  // Fetch job listings when the component mounts or when showJobListings changes
  useEffect(() => {
    if (showJobListings) {
      fetchJobListings();
    }
  }, [showJobListings]);










  // Function to fetch job listings from the server
  const fetchJobListings = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobListings(response.data); // Update job listings state
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Failed to fetch job listings:', error);
      setError('Failed to fetch job listings'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };










  // Function to confirm deletion of a job listing
  const confirmDeleteJobListing = (id) => {
    setDeleteJobId(id);
    setShowDeleteModal(true);
  };









  // Function to delete a job listing
  const deleteJobListing = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${deleteJobId}`);
      fetchJobListings(); // Refresh job listings
      setToastMessage('Job listing deleted successfully'); // Show success message
      setShowToast(true);
      setShowDeleteModal(false);
      setDeleteJobId(null);
    } catch (error) {
      console.error('Failed to delete job listing:', error);
      setToastMessage('Failed to delete job listing'); // Show error message
      setShowToast(true);
    }
  };







  // Function to handle edit button click
  const handleEditClick = (id) => {
    setEditingId(id);
  };










  // Function to save edited job listing
  const handleSave = async (id, updatedListing) => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, updatedListing);
      fetchJobListings(); // Refresh job listings
      setEditingId(null);
      setToastMessage('Job listing updated successfully'); // Show success message
      setShowToast(true);
    } catch (error) {
      console.error('Failed to update job listing:', error);
      setToastMessage('Failed to update job listing'); // Show error message
      setShowToast(true);
    }
  };










  // Function to handle cancel edit
  const handleCancel = () => {
    setEditingId(null);
  };







  // Function to navigate to applicants page
  const showApplicants = (jobId) => {
    navigate(`/job-applicants/${jobId}`);
  };

  // Function to navigate to all applications page
  const showAllApplications = () => {
    navigate('/all-applications');
  };

  // Function to navigate to test attempts page
  const showTestAttempts = () => {
    navigate('/manager-test-attempts');
  };

  // Function to navigate to interview calendar page
  const showInterviewCalendar = () => {
    navigate('/interview-calendar');
  };

  // Functions to handle modal visibility
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Filter job listings based on search term and selected category
  const filteredJobListings = jobListings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? listing.category === selectedCategory : true)
  );

















  

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // JSX Structure for rendering the component
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
              startIcon={<List />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={() => setShowJobListings(true)}
            >
              Manage Job Listings
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<BarChart />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={showTestAttempts}
            >
              View Test Attempts
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<BarChart />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={() => navigate('/hr-manager-analytics')}
            >
              View Analytics
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<CalendarToday />}
              sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
              onClick={showInterviewCalendar}
            >
              Interview Calendar
            </StyledButton>
          </Box>
          <AddJobListingModal
            show={showModal}
            handleClose={handleCloseModal}
            fetchJobListings={fetchJobListings}
          />

          {showJobListings && (
            <>
              <Box sx={{ mb: 3, display: 'flex', gap: 3 }}>
                <TextField
                  label="Search Job Listings"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Filter by Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Filter by Category"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="Web & Mobile Development">Web & Mobile Development</MenuItem>
                    <MenuItem value="Business Intelligence">Business Intelligence</MenuItem>
                    <MenuItem value="Digital Marketing & Design">Digital Marketing & Design</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Grid container spacing={4}>
                  {filteredJobListings.map((listing) => (
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
                                  <strong>Requirements:</strong> {listing.requirements.join(', ')}
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
