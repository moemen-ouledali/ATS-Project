import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';
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

const JobApplicationFormUnauth = () => {
  const { id } = useParams(); // Job ID from URL parameters
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
                Job Details
              </Typography>
              {jobDetails ? (
                <Box sx={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '5px' }}>
                <Typography variant="h5">{jobDetails.title}</Typography>
                <Typography variant="body2"><strong>Category:</strong> {jobDetails.category}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {jobDetails.jobLocation}</Typography>
                <Typography variant="body2"><strong>Type:</strong> {jobDetails.jobType}</Typography>
                <Typography variant="body2"><strong>Description:</strong> {jobDetails.description}</Typography>
                <Typography variant="body2"><strong>Requirements:</strong> {jobDetails.requirements.join(', ')}</Typography>
                <Typography variant="body2"><strong>Experience Required:</strong> {jobDetails.experienceLevel}</Typography>
                <Typography variant="body2"><strong>Degree Required:</strong> {jobDetails.minimumDegree}</Typography>
              </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              )}
              <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">Register to Apply</Button>
                </Link>
              </Typography>
            </CardContent>
          </StyledCard>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default JobApplicationFormUnauth;
