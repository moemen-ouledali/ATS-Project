import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Container, Typography, CircularProgress, Box, Grid, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

Chart.register(...registerables);

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
  },
});

const HRManagerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatusData, setApplicationStatusData] = useState(null);
  const [applicationsOverTimeData, setApplicationsOverTimeData] = useState(null);
  const [educationLevelData, setEducationLevelData] = useState(null);
  const [experienceLevelData, setExperienceLevelData] = useState(null);
  const [applicationsPerCategoryData, setApplicationsPerCategoryData] = useState(null);
  const [testScoresData, setTestScoresData] = useState(null);
  const [topUniversitiesData, setTopUniversitiesData] = useState(null);
  const [applicantsByCityData, setApplicantsByCityData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          applicationStatusRes,
          applicationsOverTimeRes,
          educationLevelRes,
          experienceLevelRes,
          applicationsPerCategoryRes,
          testScoresRes,
          topUniversitiesRes,
          applicantsByCityRes,
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics/application-status'),
          axios.get('http://localhost:5000/api/analytics/applications-over-time'),
          axios.get('http://localhost:5000/api/analytics/education-level'),
          axios.get('http://localhost:5000/api/analytics/experience-level'),
          axios.get('http://localhost:5000/api/analytics/applications-per-category'),
          axios.get('http://localhost:5000/api/analytics/test-scores'),
          axios.get('http://localhost:5000/api/analytics/top-universities'),
          axios.get('http://localhost:5000/api/analytics/applicants-by-city'),
        ]);

        setApplicationStatusData(applicationStatusRes.data);
        setApplicationsOverTimeData(applicationsOverTimeRes.data);
        setEducationLevelData(educationLevelRes.data);
        setExperienceLevelData(experienceLevelRes.data);
        setApplicationsPerCategoryData(applicationsPerCategoryRes.data);
        setTestScoresData(testScoresRes.data);
        setTopUniversitiesData(topUniversitiesRes.data);
        setApplicantsByCityData(applicantsByCityRes.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container style={{ marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ marginTop: '50px' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: theme.palette.background.default, py: 6, minHeight: '100vh' }}>
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
            Analytics Dashboard
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Application Status Distribution
                </Typography>
                <Pie data={applicationStatusData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Applications Over Time
                </Typography>
                <Line data={applicationsOverTimeData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Applicants by Education Level
                </Typography>
                <Bar data={educationLevelData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Applicants by Experience Level
                </Typography>
                <Bar data={experienceLevelData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Applications per Job Category
                </Typography>
                <Bar data={applicationsPerCategoryData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Test Scores Distribution
                </Typography>
                <Bar data={testScoresData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Top Universities of Applicants
                </Typography>
                <Bar data={topUniversitiesData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Applicants by City
                </Typography>
                <Bar data={applicantsByCityData} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HRManagerAnalytics;
