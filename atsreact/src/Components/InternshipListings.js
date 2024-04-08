import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Assuming the path to the images folder is correct. Adjust if necessary.
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
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const InternshipListings = () => {
  const [internships, setInternships] = useState([]);
  const shuffledImages = shuffleArray([...cardImages]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/joblistings', {
          params: { jobType: 'Internship' }
        });
        setInternships(response.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchInternships();
  }, []);

  return (
    <Grid container spacing={4} style={{ padding: '24px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Internship Opportunities</Typography>
      </Grid>
      {internships.length > 0 ? (
        internships.map((internship, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={internship._id}>
            <Card raised>
              <CardActionArea component={RouterLink} to={`/internship/${internship._id}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={shuffledImages[index % shuffledImages.length]}
                  alt={internship.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    {internship.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {internship.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="subtitle1">No internships available at the moment.</Typography>
      )}
    </Grid>
  );
};

export default InternshipListings;
