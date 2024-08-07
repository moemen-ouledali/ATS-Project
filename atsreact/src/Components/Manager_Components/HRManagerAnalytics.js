import React, { useState, useEffect, useCallback } from 'react'; // Import necessary hooks and libraries from React
import axios from 'axios'; // Import axios for making HTTP requests
import { Pie, Line, Bar } from 'react-chartjs-2'; // Import chart types from react-chartjs-2
import { Chart, registerables } from 'chart.js'; // Import Chart and registerables from chart.js
import { Container, Typography, CircularProgress, Box, Grid, Card, CardContent, CardHeader, Divider, TextField, Button, Avatar } from '@mui/material'; // Import various components from @mui/material
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import theming utilities from @mui/material/styles
import { styled } from '@mui/system'; // Import styled from @mui/system
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Import LocalizationProvider for date pickers
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import AdapterDateFns for date picker adapter
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker component
import { format } from 'date-fns'; // Import format function from date-fns
import maleIcon from '../../Media/ProfilePicture/male.png'; // Import male profile picture
import femaleIcon from '../../Media/ProfilePicture/female.png'; // Import female profile picture
import 'chartjs-plugin-datalabels'; // Import chartjs-plugin-datalabels for labeling charts

Chart.register(...registerables); // Register all chart.js components

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Theme Configuration
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  },
});

// Define a styled component for gradient text
const GradientText = styled('span')({
  background: 'linear-gradient(45deg, #4A90E2, #E91E63)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

// Define a styled component for cards
const StyledCard = styled(Card)({
  borderRadius: '15px',
  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Data Processing Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to sort data for charts
const sortData = (data) => {
  if (!data || !data.labels || !data.datasets || !data.datasets[0].data) {
    console.error('Invalid data structure:', data);
    return { labels: [], datasets: [] };
  }

  const labels = data.labels;
  const datasets = data.datasets[0].data;
  const combined = labels.map((label, index) => ({
    label,
    value: datasets[index],
  }));

  combined.sort((a, b) => b.value - a.value);

  return {
    labels: combined.map(item => item.label),
    datasets: [
      {
        ...data.datasets[0],
        data: combined.map(item => item.value),
      },
    ],
  };
};

// Function to process experience level data
const processExperienceLevelData = (data) => {
  const ranges = {
    '0 years': 0,
    '1-3 years': 0,
    '4-6 years': 0,
    '7+ years': 0,
  };

  data.labels.forEach((label, index) => {
    const value = data.datasets[0].data[index];
    if (label === '0 years') {
      ranges['0 years'] += value;
    } else if (['1 year', '2 years', '3 years'].includes(label)) {
      ranges['1-3 years'] += value;
    } else if (['4 years', '5 years', '6 years'].includes(label)) {
      ranges['4-6 years'] += value;
    } else {
      ranges['7+ years'] += value;
    }
  });

  return {
    labels: Object.keys(ranges),
    datasets: [
      {
        label: 'Experience Level',
        data: Object.values(ranges),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };
};













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HR Manager Analytics Component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const HRManagerAnalytics = () => {
  // State hooks for managing component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatusData, setApplicationStatusData] = useState({});
  const [applicationsOverTimeData, setApplicationsOverTimeData] = useState({});
  const [educationLevelData, setEducationLevelData] = useState({});
  const [experienceLevelData, setExperienceLevelData] = useState({});
  const [applicationsPerCategoryData, setApplicationsPerCategoryData] = useState({});
  const [testScoresData, setTestScoresData] = useState({});
  const [topUniversitiesData, setTopUniversitiesData] = useState({});
  const [applicantsByCityData, setApplicantsByCityData] = useState({});
  const [genderData, setGenderData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Function to handle date changes
  const handleDateChange = () => {
    setLoading(true);
    fetchData();
  };

  // Function to fetch data from the API
  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
      if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

      const [
        applicationStatusRes,
        applicationsOverTimeRes,
        educationLevelRes,
        experienceLevelRes,
        applicationsPerCategoryRes,
        testScoresRes,
        topUniversitiesRes,
        applicantsByCityRes,
        genderRes,
      ] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/application-status', { params }),
        axios.get('http://localhost:5000/api/analytics/applications-over-time', { params }),
        axios.get('http://localhost:5000/api/analytics/education-level', { params }),
        axios.get('http://localhost:5000/api/analytics/experience-level', { params }),
        axios.get('http://localhost:5000/api/analytics/applications-per-category', { params }),
        axios.get('http://localhost:5000/api/analytics/test-scores', { params }),
        axios.get('http://localhost:5000/api/analytics/top-universities', { params }),
        axios.get('http://localhost:5000/api/analytics/applicants-by-city', { params }),
        axios.get('http://localhost:5000/api/analytics/gender', { params }),
      ]);

      setApplicationStatusData({
        labels: applicationStatusRes.data.labels,
        datasets: [
          {
            label: 'Application Status',
            data: applicationStatusRes.data.datasets[0].data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          },
        ],
      });

      setApplicationsOverTimeData({
        labels: applicationsOverTimeRes.data.labels,
        datasets: [
          {
            label: 'Applications Over Time',
            data: applicationsOverTimeRes.data.datasets[0].data,
            fill: false,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
          },
        ],
      });

      setEducationLevelData({
        labels: educationLevelRes.data.labels,
        datasets: [
          {
            label: 'Education Level',
            data: educationLevelRes.data.datasets[0].data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      });

      setExperienceLevelData(processExperienceLevelData({
        labels: experienceLevelRes.data.labels,
        datasets: [
          {
            label: 'Experience Level',
            data: experienceLevelRes.data.datasets[0].data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      }));

      setApplicationsPerCategoryData({
        labels: applicationsPerCategoryRes.data.labels,
        datasets: [
          {
            label: 'Job Category',
            data: applicationsPerCategoryRes.data.datasets[0].data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      });

      setTestScoresData({
        labels: testScoresRes.data.labels,
        datasets: [
          {
            label: 'Test Scores',
            data: testScoresRes.data.datasets[0].data,
            backgroundColor: ['#36A2EB'],
          },
        ],
      });

      setTopUniversitiesData(sortData({
        labels: topUniversitiesRes.data.labels,
        datasets: [
          {
            label: 'Top Universities',
            data: topUniversitiesRes.data.datasets[0].data,
            backgroundColor: '#36A2EB',
          },
        ],
      }));

      setApplicantsByCityData({
        labels: applicantsByCityRes.data.labels,
        datasets: [
          {
            label: 'Applicants by City',
            data: applicantsByCityRes.data.datasets[0].data,
            backgroundColor: '#36A2EB',
          },
        ],
      });

      setGenderData({
        labels: genderRes.data.labels,
        datasets: [
          {
            label: 'Gender Distribution',
            data: genderRes.data.datasets[0].data,
            backgroundColor: ['#36A2EB', '#FF6384'], // Blue for male, pink for female
          },
        ],
      });

      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to fetch analytics data'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Fetch data when component mounts or when fetchData changes

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











  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // JSX Structure for rendering the component
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: theme.palette.background.default, py: 6, minHeight: '100vh' }}>
        <Container>
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
            <GradientText>Analytics Dashboard</GradientText>
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Box mx={2}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Box>
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={handleDateChange}>
              Apply
            </Button>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Application Status Distribution" />
                <Divider />
                <CardContent>
                  <Pie data={applicationStatusData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Applications Over Time" />
                <Divider />
                <CardContent>
                  <Line data={applicationsOverTimeData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Applicants by Education Level" />
                <Divider />
                <CardContent>
                  <Bar data={educationLevelData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Applicants by Experience Level" />
                <Divider />
                <CardContent>
                  <Bar data={experienceLevelData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Applications per Job Category" />
                <Divider />
                <CardContent>
                  <Bar data={applicationsPerCategoryData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Test Scores Distribution" />
                <Divider />
                <CardContent>
                  <Bar data={testScoresData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12}>
              <StyledCard>
                <CardHeader title="Top Universities of Applicants" />
                <Divider />
                <CardContent>
                  <Bar
                    data={topUniversitiesData}
                    options={{
                      indexAxis: 'y', // Display as horizontal bar chart
                      scales: {
                        y: {
                          ticks: {
                            font: {
                              size: 12, // Adjust the font size
                            }
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Applicants by City" />
                <Divider />
                <CardContent>
                  <Bar data={applicantsByCityData} />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <Typography variant="h5">Gender Distribution</Typography>
                      <Box ml={2} display="flex" alignItems="center">
                        <Avatar alt="Female" src={femaleIcon} />
                        <Avatar alt="Male" src={maleIcon} />
                      </Box>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Pie
                    data={genderData}
                    options={{
                      plugins: {
                        datalabels: {
                          formatter: (value, context) => {
                            let percentage = ((value / context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + '%';
                            return percentage;
                          },
                          color: '#fff',
                          font: {
                            weight: 'bold'
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HRManagerAnalytics; // Export the component as the default export
