import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

// Importing images, assuming same use as your JobListingsPage
import image1 from '../../Media/cards media/1.png';
import image2 from '../../Media/cards media/2.png';
import image3 from '../../Media/cards media/3.png';
import image4 from '../../Media/cards media/4.png';
import image5 from '../../Media/cards media/5.png';
import image6 from '../../Media/cards media/6.png';
import image7 from '../../Media/cards media/7.png';
import image8 from '../../Media/cards media/8.png';

const cardImages = [image1, image2, image3, image4, image5, image6, image7, image8];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
  return array;
}

const AllJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const shuffledImages = shuffleArray([...cardImages]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs') // Adjust this endpoint to your backend API that fetches all jobs excluding internships
      .then(response => {
        const nonInternshipJobs = response.data.filter(job => job.jobType.toLowerCase() !== 'internship');
        setJobs(nonInternshipJobs);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  return (
    <Grid container spacing={2} style={{ padding: '24px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>All Jobs</Typography>
      </Grid>
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={job._id}>
            <Card raised>
              <CardActionArea component={RouterLink} to={`/job/${job._id}`}>
                <CardMedia
                  component="img"
                  alt={job.title}
                  height="140"
                  image={shuffledImages[index % shuffledImages.length]}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {job.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" component={RouterLink} to={`/job/${job._id}`}>
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="subtitle1">No jobs found.</Typography>
      )}
    </Grid>
  );
};

export default AllJobsPage;
