import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Adjust the import path as necessary
import { Container, Box, Typography, TextField, Button, Card, CardContent, CircularProgress, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#50E3C2',
    },
    background: {
      default: '#f7f9fc',
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
      textTransform: 'uppercase',
      fontWeight: 700,
      fontSize: '0.875rem',
    },
  },
});

const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  borderRadius: '15px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#fff',
  backgroundImage: 'linear-gradient(135deg, #fff 30%, #f3e5f5 90%)',
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

const JobApplicationForm = () => {
  const { id } = useParams(); // Job ID from URL parameters
  const { userDetails, authToken } = useContext(AuthContext); // User details from context

  const [application, setApplication] = useState({
    name: userDetails.fullName || '',
    email: userDetails.email || '',
    phone: userDetails.phoneNumber || '',
    educationLevel: '',
    experienceLevel: '',
    university: '',
    motivationLetter: '',
    resume: null,
  });

  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    // Fetch job details
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(response => {
        setJobDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
        alert('Failed to fetch job details.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplication(prev => ({ ...prev, resume: files[0] }));
    } else {
      setApplication(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(application).forEach(key => {
      if (key === 'resume' && application[key]) {
        formData.append('resume', application[key]);
      } else {
        formData.append(key, application[key]);
      }
    });
    formData.append('jobId', id);

    axios.post('http://localhost:5000/api/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`
      }
    })
    .then(response => {
      alert('Application submitted successfully!');
      console.log(response.data);
    })
    .catch(error => {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: 'linear-gradient(135deg, #4400E7 30%, #B71A89 90%)', py: 6, minHeight: '100vh' }}>
        <Container maxWidth="md">
          <StyledCard raised>
            <CardContent>
              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                }}
              >
                Apply for the Job
              </Typography>
              {jobDetails ? (
                <Box sx={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '5px' }}>
                  <Typography variant="h5">{jobDetails.title}</Typography>
                  <Typography variant="body2"><strong>Category:</strong> {jobDetails.category}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {jobDetails.jobLocation}</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {jobDetails.jobType}</Typography>
                  <Typography variant="body2"><strong>Description:</strong> {jobDetails.description}</Typography>
                  <Typography variant="body2"><strong>Requirements:</strong> {jobDetails.requirements}</Typography>
                  <Typography variant="body2"><strong>Experience Required:</strong> {jobDetails.experienceLevel}</Typography>
                  <Typography variant="body2"><strong>Minimum Degree:</strong> {jobDetails.minimumDegree}</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField type="text" name="name" value={application.name} onChange={handleChange} label="Your Name" required fullWidth />
                <TextField type="email" name="email" value={application.email} onChange={handleChange} label="Your Email" required fullWidth />
                <TextField type="text" name="phone" value={application.phone} onChange={handleChange} label="Your Phone Number" required fullWidth />
                <TextField
                  select
                  name="educationLevel"
                  value={application.educationLevel}
                  onChange={handleChange}
                  label="Minimum Degree"
                  required
                  fullWidth
                >
                  <MenuItem value="">Select Minimum Degree</MenuItem>
                  <MenuItem value="Licence">Licence</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Baccalaureate">Baccalaureate</MenuItem>
                </TextField>
                <TextField
                  select
                  name="experienceLevel"
                  value={application.experienceLevel}
                  onChange={handleChange}
                  label="Experience Level"
                  required
                  fullWidth
                >
                  <MenuItem value="">Select Experience Level</MenuItem>
                  <MenuItem value="0 years">0 years</MenuItem>
                  <MenuItem value="1-3 years">1-3 years</MenuItem>
                  <MenuItem value="4-6 years">4-6 years</MenuItem>
                  <MenuItem value="7+ years">7+ years</MenuItem>
                </TextField>
                <TextField type="text" name="university" value={application.university} onChange={handleChange} label="Your University" fullWidth />
                <TextField
                  multiline
                  rows={4}
                  name="motivationLetter"
                  value={application.motivationLetter}
                  onChange={handleChange}
                  label="Your Motivation Letter"
                  required
                  fullWidth
                />
                <TextField type="file" name="resume" onChange={handleChange} accept="application/pdf" required fullWidth />
                <StyledButton type="submit" fullWidth>Submit Application</StyledButton>
              </form>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default JobApplicationForm;
