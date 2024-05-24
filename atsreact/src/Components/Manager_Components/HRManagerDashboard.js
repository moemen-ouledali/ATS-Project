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
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4400E7 30%, #B71A89 90%)',
        py: 6,
      }}
    >
      <Container
        component={Paper}
        elevation={3}
        sx={{ p: 6, borderRadius: 3, background: 'white' }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome HR Manager
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', gap: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Visibility />}
            sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
            onClick={showAllApplications}
          >
            Show All Applications
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
            onClick={handleShowModal}
          >
            Add Job Listing
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: '1.2rem', padding: '12px 24px' }}
            onClick={() => setShowJobListings(true)}
          >
            Manage Job Listings
          </Button>
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
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, #fff 30%, #f3e5f5 90%)',
                        borderRadius: 3,
                        boxShadow: 4,
                      }}
                    >
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
                            <Typography variant="body1" component="p">
                              <strong>Location:</strong> {listing.jobLocation}
                            </Typography>
                            <Typography variant="body1" component="p">
                              <strong>Type:</strong> {listing.jobType}
                            </Typography>
                            <Typography variant="body1" component="p">
                              <strong>Description:</strong> {listing.description}
                            </Typography>
                            <Typography variant="body1" component="p">
                              <strong>Requirements:</strong> {listing.requirements}
                            </Typography>
                            <Typography variant="body1" component="p">
                              <strong>Experience Level:</strong> {listing.experienceLevel}
                            </Typography>
                            <Typography variant="body1" component="p">
                              <strong>Minimum Degree:</strong> {listing.minimumDegree}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="large"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => handleEditClick(listing._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="large"
                          color="secondary"
                          startIcon={<Delete />}
                          onClick={() => confirmDeleteJobListing(listing._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="large"
                          color="success"
                          startIcon={<Visibility />}
                          onClick={() => showApplicants(listing._id)}
                        >
                          Show Applicants
                        </Button>
                      </CardActions>
                    </Card>
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
  );
};

export default HRManagerDashboard;
