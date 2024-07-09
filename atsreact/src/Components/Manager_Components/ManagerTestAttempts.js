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

const calculateMatchPercentage = (requirements = [], resumeText = '') => {
  if (!requirements.length || !resumeText) return 0;
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const matchedRequirements = requirements.filter(requirement =>
    resumeWords.includes(requirement.toLowerCase())
  );
  const percentage = (matchedRequirements.length / requirements.length) * 100;
  return percentage.toFixed(2); // Return the percentage with two decimal points
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'appliedOn', direction: 'asc' });
  const attemptsPerPage = 10;

  useEffect(() => {
    const fetchTestAttempts = async () => {
      try {
        const response = await axios.get('https://ats-project-1.onrender.com/api/tests/all-attempts');
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

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleAcceptApplication = async () => {
    if (!selectedApplication || !selectedApplication.application) {
      console.error('Selected application is not properly set.');
      return;
    }
    try {
      console.log(`Accepting application: ${selectedApplication.application._id}`);
      const response = await axios.put(
        `https://ats-project-1.onrender.com/api/applications/accept-after-test/${selectedApplication.application._id}`,
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

  const handleDeclineApplication = async () => {
    if (!selectedApplication || !selectedApplication.application) {
      console.error('Selected application is not properly set.');
      return;
    }
    try {
      console.log(`Declining application: ${selectedApplication.application._id}`);
      const response = await axios.put(`https://ats-project-1.onrender.com/api/applications/decline-after-test/${selectedApplication.application._id}`);
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

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction });
  };

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
  });

  const filteredAttempts = sortedAttempts.filter(attempt =>
    (searchTerm === '' || (attempt.user && (attempt.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || attempt.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())))) &&
    (selectedStatus === '' || (attempt.application && attempt.application.status === selectedStatus)) &&
    (selectedCategory === '' || (attempt.test && attempt.test.category === selectedCategory)) &&
    (startDate === null || new Date(attempt.application.createdAt) >= startDate) &&
    (endDate === null || new Date(attempt.application.createdAt) <= endDate)
  );

  const paginatedAttempts = filteredAttempts.slice((currentPage - 1) * attemptsPerPage, currentPage * attemptsPerPage);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(135deg, #F5F5F5 30%, #E0E0E0 90%)', py: 6, minHeight: '100vh' }}>
        <Container component={Paper} elevation={3} sx={{ p: 6, borderRadius: 3, background: 'white' }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', color: theme.palette.primary.main }}>
            Test Attempts
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <TextField label="Search Attempts" variant="outlined" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} fullWidth sx={{ marginRight: '10px' }} />
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
            <FormControl variant="outlined" fullWidth sx={{ marginRight: '10px' }}>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} label="Category">
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Web & Mobile Development">Web & Mobile Development</MenuItem>
                <MenuItem value="Business Intelligence">Business Intelligence</MenuItem>
                <MenuItem value="Digital Marketing & Design">Digital Marketing & Design</MenuItem>
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
                      <TableCell>Candidate Name</TableCell>
                      <TableCell>Test Category</TableCell>
                      <TableCell onClick={() => handleSort('score')} style={{ cursor: 'pointer' }}>
                        Score {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell>Application Status</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell onClick={() => handleSort('appliedOn')} style={{ cursor: 'pointer' }}>
                        Applied On {sortConfig.key === 'appliedOn' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell onClick={() => handleSort('matchPercentage')} style={{ cursor: 'pointer' }}>
                        Match Percentage {sortConfig.key === 'matchPercentage' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAttempts.map(attempt => {
                      const matchPercentage = attempt.matchPercentage;
                      const scoreColor = attempt.score < 10 ? 'red' : attempt.score < 15 ? 'orange' : 'green';
                      return (
                        <TableRow key={attempt._id}>
                          <TableCell>{attempt.user ? `${attempt.user.firstName} ${attempt.user.lastName}` : 'N/A'}</TableCell>
                          <TableCell>{attempt.test ? attempt.test.category : 'N/A'}</TableCell>
                          <TableCell style={{ color: scoreColor, fontWeight: 'bold' }}>
                            {attempt.score}/20
                          </TableCell>
                          <TableCell>{attempt.application ? attempt.application.status : 'N/A'}</TableCell>
                          <TableCell>{attempt.jobTitle}</TableCell>
                          <TableCell>{new Date(attempt.application.createdAt).toLocaleDateString()} {new Date(attempt.application.createdAt).toLocaleTimeString()}</TableCell>
                          <TableCell>{matchPercentage}%</TableCell>
                          <TableCell>
                            <AcceptButton onClick={() => { setOpenAcceptDialog(true); setSelectedApplication(attempt); }}>
                              Accept
                            </AcceptButton>
                            <DeclineButton onClick={() => { setOpenDeclineDialog(true); setSelectedApplication(attempt); }}>
                              Decline
                            </DeclineButton>
                            <ViewButton onClick={() => handleViewApplication(attempt)}>
                              View Application
                            </ViewButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination count={Math.ceil(filteredAttempts.length / attemptsPerPage)} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
              </Box>
            </>
          )}
          {selectedApplication && (
            <Dialog open={true} onClose={handleCloseModal} maxWidth="md" fullWidth>
              <DialogTitle>Application Details</DialogTitle>
              <DialogContent>
                <Typography variant="h6" component="p"><strong>Name:</strong> {selectedApplication.application.name}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Email:</strong> {selectedApplication.application.email}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Phone:</strong> {selectedApplication.application.phone}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Education Level:</strong> {selectedApplication.application.educationLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Experience Level:</strong> {selectedApplication.application.experienceLevel}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>University:</strong> {selectedApplication.application.university}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Motivation Letter:</strong> {selectedApplication.application.motivationLetter}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Resume:</strong> <a href={`https://ats-project-1.onrender.com/${selectedApplication.application.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Status:</strong> {selectedApplication.application.status}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Applied on:</strong> {new Date(selectedApplication.application.createdAt).toLocaleDateString()} {new Date(selectedApplication.application.createdAt).toLocaleTimeString()}</Typography>
                <Typography variant="body2" color="textSecondary" component="p"><strong>Match Percentage:</strong> {selectedApplication.matchPercentage}%</Typography>
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
              </DialogContent>
              <DialogActions>
                <MuiButton onClick={handleCloseModal} color="primary">
                  Close
                </MuiButton>
              </DialogActions>
            </Dialog>
          )}

          {/* Accept Dialog */}
          <Dialog open={openAcceptDialog} onClose={() => setOpenAcceptDialog(false)} maxWidth="xs" fullWidth>
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
              <MuiButton onClick={() => setOpenAcceptDialog(false)} color="primary">
                Cancel
              </MuiButton>
              <MuiButton onClick={handleAcceptApplication} color="primary">
                Accept
              </MuiButton>
            </DialogActions>
          </Dialog>

          {/* Decline Dialog */}
          <Dialog open={openDeclineDialog} onClose={() => setOpenDeclineDialog(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Decline Application</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to decline this application?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={() => setOpenDeclineDialog(false)} color="primary">
                Cancel
              </MuiButton>
              <MuiButton onClick={handleDeclineApplication} color="primary">
                Decline
              </MuiButton>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ManagerTestAttempts;
