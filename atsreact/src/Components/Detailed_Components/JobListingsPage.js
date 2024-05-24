import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

// Importing images
import image1 from '../../Media/cards media/1.png';
import image2 from '../../Media/cards media/2.png';
import image3 from '../../Media/cards media/3.png';
import image4 from '../../Media/cards media/4.png';
import image5 from '../../Media/cards media/5.png';
import image6 from '../../Media/cards media/6.png';
import image7 from '../../Media/cards media/7.png';
import image8 from '../../Media/cards media/8.png';

const cardImages = [image1, image2, image3, image4, image5, image6, image7, image8];

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
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
  return array;
}

const JobListingsPage = () => {
  const { category } = useParams();
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const shuffledImages = shuffleArray([...cardImages]);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs?category=${encodeURIComponent(category)}`);
        const nonInternshipJobs = response.data.filter(listing => listing.jobType.toLowerCase() !== 'internship');
        setJobListings(nonInternshipJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        setLoading(false);
      }
    };

    fetchJobListings();
  }, [category]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '40px 24px', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
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
          <span className="text-gradient d-inline">Job Listings for "{decodeURIComponent(category)}"</span>
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {jobListings.length > 0 ? (
              jobListings.map((listing, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id}>
                  <StyledCard raised>
                    <CardActionArea component={RouterLink} to={`/job/${listing._id}`}>
                      <CardMedia
                        component="img"
                        alt={listing.title}
                        height="500"
                        width="500"
                        image={shuffledImages[index % shuffledImages.length]}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {listing.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {listing.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <StyledButton size="small" component={RouterLink} to={`/job/${listing._id}`}>
                        Apply Now
                      </StyledButton>
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))
            ) : (
              <Typography variant="subtitle1" sx={{ textAlign: 'center', width: '100%' }}>
                No job listings found in this category.
              </Typography>
            )}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default JobListingsPage;
