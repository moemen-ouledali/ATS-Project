import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';

// Importing all images
import image1 from '../Media/cards media/1.png';
import image2 from '../Media/cards media/2.png';
import image3 from '../Media/cards media/3.png';
import image4 from '../Media/cards media/4.png';
import image5 from '../Media/cards media/5.png';
import image6 from '../Media/cards media/6.png';
import image7 from '../Media/cards media/7.png';
import image8 from '../Media/cards media/8.png';

const cardImages = [image1, image2, image3, image4, image5, image6, image7, image8];

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
  const shuffledImages = shuffleArray([...cardImages]);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/joblistings?category=${encodeURIComponent(category)}`);
        // Filter out internships from the fetched job listings before setting state.
        const nonInternshipJobs = response.data.filter(listing => listing.jobType.toLowerCase() !== 'internship');
        setJobListings(nonInternshipJobs);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    fetchJobListings();
  }, [category]);

  return (
    <Grid container spacing={2} style={{ padding: '24px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Job Listings in {decodeURIComponent(category)}</Typography>
      </Grid>
      {jobListings.length > 0 ? (
        jobListings.map((listing, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id}>
            <Card raised>
              <CardActionArea component={RouterLink} to={`/job/${listing._id}`}>
                <CardMedia
                  component="img"
                  alt={listing.title}
                  height="140"
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
              <CardActions>
                <Button size="small" color="primary" component={RouterLink} to={`/job/${listing._id}`}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="subtitle1">No job listings found in this category.</Typography>
      )}
    </Grid>
  );
};

export default JobListingsPage;
