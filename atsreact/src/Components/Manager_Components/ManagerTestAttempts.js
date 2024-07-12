import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Pagination,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

/********************************************************************
 Material-UI's createTheme.
 ********************************************************************/
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

/********************************************************************
 * Custom button styles using Material-UI's styled function.
 * The GradientButton component is the base for other buttons.
 ********************************************************************/
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















/********************************************************************
 * Function to calculate match percentage between job requirements and resume text.
 * It returns the percentage of requirements that are matched in the resume.
 ********************************************************************/
const calculateMatchPercentage = (requirements = [], resumeText = '') => {
  if (!requirements.length || !resumeText) return 0;
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matchedRequirements = requirements.filter(requirement =>
    resumeWords.includes(requirement.toLowerCase())
  );
  const percentage = (matchedRequirements.length / requirements.length) * 100;
  return percentage.toFixed(2); // Return the percentage with two decimal points
};

















/********************************************************************
 * Function to get matched and unmatched requirements.
 * It returns an object with matched and unmatched arrays.
 ********************************************************************/
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
















/********************************************************************
 * Main component to manage and display test attempts.
 ********************************************************************/
const ManagerTestAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'appliedOn', direction: 'asc' });
  const attemptsPerPage = 10;
















  /********************************************************************
   * useEffect hook to fetch test attempts from the server when the component mounts.
   ********************************************************************/
  useEffect(() => {
    const fetchTestAttempts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tests/all-attempts');
        const data = response.data.map(attempt => ({
          ...attempt,
          matchPercentage: calculateMatchPercentage(attempt.jobRequirements || [], attempt.application.resumeText || '')
        }));
        setAttempts(data);
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



















  /********************************************************************
   * Function to handle viewing an application.
   * Sets the selected application state.
   ********************************************************************/
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
  };











  /********************************************************************
   * Function to close the application details modal.
   ********************************************************************/
  const handleCloseModal = () => {
    setSelectedApplication(null);
  };
















  /********************************************************************
   * Function to handle accepting an application.
   * Sends a request to the server to update the application status.
   ********************************************************************/
  const handleAcceptApplication = async () => {
    if (!selectedApplication || !selectedApplication.application) {
      console.error('Selected application is not properly set.');
      return;
    }
    try {
      console.log(`Accepting application: ${selectedApplication.application._id}`);
      const response = await axios.put(
        `http://localhost:5000/api/applications/accept-after-test/${selectedApplication.application._id}`,
        { date: interviewDate, time: interviewTime }
      );
      setAttempts(attempts.map(attempt =>
        attempt.application._id === selectedApplication.application._id
          ? { ...attempt, application: response.data }
          : attempt
      ));
      console.log('Application accepted:', response.data);
      setOpenAcceptDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to accept application:', error);
    }
  };
















  /********************************************************************
   * Function to handle declining an application.
   * Sends a request to the server to update the application status.
   ********************************************************************/
  const handleDeclineApplication = async () => {
    if (!selectedApplication || !selectedApplication.application) {
      console.error('Selected application is not properly set.');
      return;
    }
    try {
      console.log(`Declining application: ${selectedApplication.application._id}`);
      const response = await axios.put(`http://localhost:5000/api/applications/decline-after-test/${selectedApplication.application._id}`);
      setAttempts(attempts.map(attempt =>
        attempt.application._id === selectedApplication.application._id
          ? { ...attempt, application: response.data }
          : attempt
      ));
      console.log('Application declined:', response.data);
      setOpenDeclineDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to decline application:', error);
    }
  };



















  /********************************************************************
   * Function to handle sorting of the attempts table.
   ********************************************************************/
  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction });
  };
















  /********************************************************************
   * Sort and filter the attempts based on user input and sorting configuration.
   ********************************************************************/
  const sortedAttempts = [...attempts].sort((a, b) => {
    if (sortConfig.key === 'appliedOn') {
      return sortConfig.direction === 'asc'
        ? new Date(a.application.createdAt) - new Date(b.application.createdAt)
        : new Date(b.application.createdAt) - new Date(a.application.createdAt);
    }
    if (sortConfig.key === 'matchPercentage') {
      return sortConfig.direction === 'asc'
        ? a.matchPercentage - b.matchPercentage
        : b.matchPercentage - a.matchPercentage;
    }
    if (sortConfig.key === 'score') {
      return sortConfig.direction === 'asc'
        ? a.score - b.score
        : b.score - a.score;
    }
    return 0;
  }).filter(attempt => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      (!selectedStatus || attempt.application.status === selectedStatus) &&
      (!selectedCategory || attempt.category === selectedCategory) &&
      (!searchTerm || attempt.application.name.toLowerCase().includes(lowercasedSearchTerm)) &&
      (!startDate || new Date(attempt.application.createdAt) >= startDate) &&
      (!endDate || new Date(attempt.application.createdAt) <= endDate)
    );
  });

















  /********************************************************************
   * Calculate the number of pages needed based on the filtered attempts.
   ********************************************************************/
  const pageCount = Math.ceil(sortedAttempts.length / attemptsPerPage);














  /********************************************************************
   * Slice the sorted attempts array to get only the attempts for the current page.
   ********************************************************************/
  const paginatedAttempts = sortedAttempts.slice(
    (currentPage - 1) * attemptsPerPage,
    currentPage * attemptsPerPage
  );

























  
  /********************************************************************
   * Render the component.
   ********************************************************************/
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Manager Test Attempts
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <TextField
                label="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
              <FormControl variant="outlined" style={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" style={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                customInput={<TextField variant="outlined" label="Start Date" />}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                customInput={<TextField variant="outlined" label="End Date" />}
              />
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('name')}>Name</TableCell>
                    <TableCell onClick={() => handleSort('status')}>Status</TableCell>
                    <TableCell onClick={() => handleSort('category')}>Category</TableCell>
                    <TableCell onClick={() => handleSort('appliedOn')}>Applied On</TableCell>
                    <TableCell onClick={() => handleSort('matchPercentage')}>Match %</TableCell>
                    <TableCell onClick={() => handleSort('score')}>Score</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAttempts.map((attempt) => (
                    <TableRow key={attempt._id}>
                      <TableCell>{attempt.application.name}</TableCell>
                      <TableCell>{attempt.application.status}</TableCell>
                      <TableCell>{attempt.category}</TableCell>
                      <TableCell>{new Date(attempt.application.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{attempt.matchPercentage}%</TableCell>
                      <TableCell>{attempt.score}</TableCell>
                      <TableCell>
                        <ViewButton onClick={() => handleViewApplication(attempt)}>View</ViewButton>
                        <AcceptButton onClick={() => { setSelectedApplication(attempt); setOpenAcceptDialog(true); }}>Accept</AcceptButton>
                        <DeclineButton onClick={() => { setSelectedApplication(attempt); setOpenDeclineDialog(true); }}>Decline</DeclineButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" my={2}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
              />
            </Box>
          </>
        )}
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
              variant="outlined"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Interview Time"
              type="time"
              fullWidth
              variant="outlined"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setOpenAcceptDialog(false)}>Cancel</MuiButton>
            <MuiButton onClick={handleAcceptApplication}>Accept</MuiButton>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeclineDialog} onClose={() => setOpenDeclineDialog(false)}>
          <DialogTitle>Decline Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to decline this application?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setOpenDeclineDialog(false)}>Cancel</MuiButton>
            <MuiButton onClick={handleDeclineApplication}>Decline</MuiButton>
          </DialogActions>
        </Dialog>
        <Dialog open={!!selectedApplication} onClose={handleCloseModal}>
          <DialogTitle>Application Details</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <>
                <Typography variant="h6">{selectedApplication.application.name}</Typography>
                <Typography variant="body1">Status: {selectedApplication.application.status}</Typography>
                <Typography variant="body1">Category: {selectedApplication.category}</Typography>
                <Typography variant="body1">Applied On: {new Date(selectedApplication.application.createdAt).toLocaleDateString()}</Typography>
                <Typography variant="body1">Match Percentage: {selectedApplication.matchPercentage}%</Typography>
                <Typography variant="body1">Score: {selectedApplication.score}</Typography>
                <Typography variant="h6" mt={2}>Matched Requirements:</Typography>
                <ul>
                  {getMatchedUnmatchedRequirements(selectedApplication.jobRequirements, selectedApplication.application.resumeText).matched.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
                <Typography variant="h6" mt={2}>Unmatched Requirements:</Typography>
                <ul>
                  {getMatchedUnmatchedRequirements(selectedApplication.jobRequirements, selectedApplication.application.resumeText).unmatched.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseModal}>Close</MuiButton>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default ManagerTestAttempts;
