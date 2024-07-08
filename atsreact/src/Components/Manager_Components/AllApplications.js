// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Pagination, Button as MuiButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker component
import DatePicker from 'react-datepicker'; // Import DatePicker component






// Create a custom theme for Material-UI components
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Primary color
    },
    secondary: {
      main: '#E91E63', // Secondary color
    },
    background: {
      default: '#F5F5F5', // Default background color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Default font family
    h4: {
      fontWeight: 800,
      color: '#333',
      fontSize: '2rem', // Heading 4 style
    },
    h5: {
      fontWeight: 700,
      color: '#555',
      fontSize: '1.5rem', // Heading 5 style
    },
    body2: {
      color: '#777',
      fontSize: '1rem', // Body text style
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.875rem', // Button text style
    },
  },
});







// Create a styled button with a gradient background
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









// Specific styled buttons with different gradients
const AcceptButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #4CAF50, #66BB6A)', // Green gradient for accept button
});

const DeclineButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #F44336, #E57373)', // Red gradient for decline button
});

const ViewButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #4A90E2, #357ABD)', // Blue gradient for view button
});








// Function to calculate match percentage between requirements and resume text
const calculateMatchPercentage = (requirements, resumeText) => {
  const resumeWords = resumeText.toLowerCase().split(/\s+/); // Split resume text into words
  const matchedRequirements = requirements.filter(requirement =>
    resumeWords.includes(requirement.toLowerCase())
  );
  const percentage = (matchedRequirements.length / requirements.length) * 100; // Calculate percentage
  return percentage;
};









// Function to get matched and unmatched requirements
const getMatchedUnmatchedRequirements = (requirements, resumeText) => {
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matched = [];
  const unmatched = [];
  requirements.forEach(requirement => {
    if (resumeWords.includes(requirement.toLowerCase())) {
      matched.push(requirement); // Add to matched if found in resume
    } else {
      unmatched.push(requirement); // Add to unmatched if not found
    }
  });
  return { matched, unmatched };
};











// Define the main AllApplications component
const AllApplications = () => {
  const [applications, setApplications] = useState([]); // State to hold all applications
  const [selectedApplication, setSelectedApplication] = useState(null); // State to hold selected application for modal
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle error state
  const [searchTerm, setSearchTerm] = useState(''); // State to handle search term
  const [selectedStatus, setSelectedStatus] = useState(''); // State to handle selected status filter
  const [startDate, setStartDate] = useState(null); // State to handle start date filter
  const [endDate, setEndDate] = useState(null); // State to handle end date filter
  const [currentPage, setCurrentPage] = useState(1); // State to handle current page for pagination
  const [sortConfig, setSortConfig] = useState({ key: 'appliedOn', direction: 'asc' }); // State to handle sorting configuration
  const applicationsPerPage = 10; // Number of applications to show per page






  // Fetch all applications when the component mounts
  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applications/all'); // Fetch applications from API
        setApplications(response.data); // Set applications state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error('Failed to fetch applications:', error); // Log error if fetch fails
        setError('Failed to fetch applications'); // Set error state
        setLoading(false); // Set loading to false
      }
    };

    fetchAllApplications();
  }, []);










  // Accept application and update its status
  const acceptApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/accept/${appId}`);
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: 'Accepted' } : app
      );
      setApplications(updatedApplications); // Update applications state
    } catch (error) {
      console.error('Failed to accept application:', error); // Log error if request fails
    }
  };








  // Decline application and update its status
  const declineApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/decline/${appId}`);
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: 'Declined' } : app
      );
      setApplications(updatedApplications); // Update applications state
    } catch (error) {
      console.error('Failed to decline application:', error); // Log error if request fails
    }
  };








  // Show application details in a modal
  const showApplicationDetails = (application) => {
    setSelectedApplication(application); // Set selected application state
  };






  // Close application details modal
  const closeApplicationDetails = () => {
    setSelectedApplication(null); // Reset selected application state
  };






  // Handle sorting applications by field
  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction }); // Update sort configuration
  };








  // Sort applications based on sort configuration
  const sortedApplications = [...applications].sort((a, b) => {
    if (sortConfig.key === 'appliedOn') {
      return sortConfig.direction === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortConfig.key === 'matchPercentage' && a.jobId && b.jobId) {
      return sortConfig.direction === 'asc'
        ? calculateMatchPercentage(a.jobId.requirements, a.resumeText) - calculateMatchPercentage(b.jobId.requirements, b.resumeText)
        : calculateMatchPercentage(b.jobId.requirements, b.resumeText) - calculateMatchPercentage(a.jobId.requirements, a.resumeText);
    }
    return 0;
  });








  // Filter applications based on search term, status, and date range
  const filteredApplications = sortedApplications.filter(app =>
    (searchTerm === '' || app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus === '' || app.status === selectedStatus) &&
    (startDate === null || new Date(app.createdAt) >= startDate) &&
    (endDate === null || new Date(app.createdAt) <= endDate)
  );










  // Paginate filtered applications
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * applicationsPerPage, currentPage * applicationsPerPage);












  // Render applications
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(135deg, #F5F5F5 30%, #E0E0E0 90%)', py: 6, minHeight: '100vh' }}>
        <Container component={Paper} elevation={3} sx={{ p: 6, borderRadius: 3, background: 'white' }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', color: theme.palette.primary.main }}>
            All Applications
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <TextField label="Search Applications" variant="outlined" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} fullWidth sx={{ marginRight: '10px' }} />
            <FormControl variant="outlined" fullWidth sx={{ marginRight: '10px' }}>
              <InputLabel>Status</InputLabel>
              <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} label="Status">
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="in review">In Review</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
                <MenuItem value="accepted for interview">Accepted for Interview</MenuItem>
                <MenuItem value="declined after evaluation test">Declined after Evaluation Test</MenuItem>
              </Select>
            </FormControl>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} placeholderText="Start Date" className="form-control" />
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} placeholderText="End Date" className="form-control" />
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell onClick={() => handleSort('appliedOn')} style={{ cursor: 'pointer' }}>Applied On {sortConfig.key === 'appliedOn' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</TableCell>
                      <TableCell onClick={() => handleSort('matchPercentage')} style={{ cursor: 'pointer' }}>Match Percentage {sortConfig.key === 'matchPercentage' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedApplications.map(app => {
                      const matchPercentage = app.jobId ? calculateMatchPercentage(app.jobId.requirements, app.resumeText) : 0;
                      return (
                        <TableRow key={app._id}>
                          <TableCell>{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.jobId ? app.jobId.title : 'No job title available'}</TableCell>
                          <TableCell>{app.status}</TableCell>
                          <TableCell>{new Date(app.createdAt).toLocaleDateString()} {new Date(app.createdAt).toLocaleTimeString()}</TableCell>
                          <TableCell>{matchPercentage.toFixed(0)}%</TableCell>
                          <TableCell>
                            <AcceptButton onClick={() => acceptApplication(app._id)}>Pre-Accept</AcceptButton>
                            <DeclineButton onClick={() => declineApplication(app._id)}>Decline</DeclineButton>
                            <ViewButton onClick={() => showApplicationDetails(app)}>View Details</ViewButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination count={Math.ceil(filteredApplications.length / applicationsPerPage)} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
              </Box>
            </>
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
                <Typography variant="body2" color="textSecondary" component="p"><strong>Job Title:</strong> {selectedApplication.jobId ? selectedApplication.jobId.title : 'No job title available'}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {selectedApplication.educationLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {selectedApplication.experienceLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>University:</strong> {selectedApplication.university}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Motivation Letter:</strong> {selectedApplication.motivationLetter}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Resume:</strong> <a href={`http://localhost:5000/${selectedApplication.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {selectedApplication.status}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()} {new Date(selectedApplication.createdAt).toLocaleTimeString()}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Match Percentage:</strong> {selectedApplication.jobId ? calculateMatchPercentage(selectedApplication.jobId.requirements, selectedApplication.resumeText) : 0}%</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Matched Requirements:</strong></Typography>
                <ul>
                  {selectedApplication.jobId && getMatchedUnmatchedRequirements(selectedApplication.jobId.requirements, selectedApplication.resumeText).matched.map((req, index) => (
                    <li key={index} style={{ color: 'green' }}>{req}</li>
                  ))}
                </ul>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Unmatched Requirements:</strong></Typography>
                <ul>
                  {selectedApplication.jobId && getMatchedUnmatchedRequirements(selectedApplication.jobId.requirements, selectedApplication.resumeText).unmatched.map((req, index) => (
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

export default AllApplications;
