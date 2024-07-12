/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Import necessary libraries and components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';  // Import React and hooks for state and effect management
import axios from 'axios';  // Import axios for making HTTP requests
import { Modal, Button as BootstrapButton } from 'react-bootstrap';  // Import components from react-bootstrap
import { 
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, Select, MenuItem, 
  InputLabel, FormControl, CircularProgress, Pagination, Button as MuiButton 
} from '@mui/material';  // Import various components from @mui/material
import { createTheme, ThemeProvider } from '@mui/material/styles';  // Import theming utilities from @mui/material
import { styled } from '@mui/system';  // Import styled utility from @mui/system
import 'react-datepicker/dist/react-datepicker.css';  // Import CSS for date picker
import DatePicker from 'react-datepicker';  // Import DatePicker component from react-datepicker











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define theme for Material UI components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',  // Primary color
    },
    secondary: {
      main: '#E91E63',  // Secondary color
    },
    background: {
      default: '#F5F5F5',  // Default background color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',  // Set default font family
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











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define styled button components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define helper functions for matching and sorting requirements
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the main component for managing and displaying all applications
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const AllApplications = () => {
  const [applications, setApplications] = useState([]);  // State to store applications
  const [selectedApplication, setSelectedApplication] = useState(null);  // State to store selected application
  const [loading, setLoading] = useState(true);  // State to manage loading status
  const [error, setError] = useState(null);  // State to manage error messages
  const [searchTerm, setSearchTerm] = useState('');  // State to store search term
  const [selectedStatus, setSelectedStatus] = useState('');  // State to store selected status
  const [startDate, setStartDate] = useState(null);  // State to store start date for filtering
  const [endDate, setEndDate] = useState(null);  // State to store end date for filtering
  const [currentPage, setCurrentPage] = useState(1);  // State to manage current page for pagination
  const [sortConfig, setSortConfig] = useState({ key: 'appliedOn', direction: 'asc' });  // State to manage sorting configuration
  const applicationsPerPage = 10;  // Number of applications to show per page

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applications/all');  // Fetch all applications
        setApplications(response.data);  // Set applications data
        setLoading(false);  // Set loading to false after fetching data
      } catch (error) {
        console.error('Failed to fetch applications:', error);  // Log error if fetching fails
        setError('Failed to fetch applications');  // Set error message
        setLoading(false);  // Set loading to false after error
      }
    };

    fetchAllApplications();  // Call the function to fetch applications
  }, []);  // Empty dependency array to run effect only once













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define functions for accepting, declining, and viewing application details
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const acceptApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/accept/${appId}`);  // Send request to accept application
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: 'Accepted' } : app
      );  // Update the status of the accepted application
      setApplications(updatedApplications);  // Update state with new applications list
    } catch (error) {
      console.error('Failed to accept application:', error);  // Log error if accepting fails
    }
  };

  const declineApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/decline/${appId}`);  // Send request to decline application
      const updatedApplications = applications.map(app =>
        app._id === appId ? { ...app, status: 'Declined' } : app
      );  // Update the status of the declined application
      setApplications(updatedApplications);  // Update state with new applications list
    } catch (error) {
      console.error('Failed to decline application:', error);  // Log error if declining fails
    }
  };

  const showApplicationDetails = (application) => {
    setSelectedApplication(application);  // Set the selected application for viewing details
  };

  const closeApplicationDetails = () => {
    setSelectedApplication(null);  // Close the application details modal
  };









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define function for sorting applications
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction });  // Update sort configuration
  };











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define filtering, sorting, and pagination for applications
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  const filteredApplications = sortedApplications.filter(app =>
    (searchTerm === '' || app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus === '' || app.status === selectedStatus) &&
    (startDate === null || new Date(app.createdAt) >= startDate) &&
    (endDate === null || new Date(app.createdAt) <= endDate)
  );

  const paginatedApplications = filteredApplications.slice((currentPage - 1) * applicationsPerPage, currentPage * applicationsPerPage);














  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render the component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

export default AllApplications;  // Export the main component
