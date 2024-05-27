// src/Components/ViewProfile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const ViewProfile = () => {
  const { applicantId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applicants/${applicantId}`);
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [applicantId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{profile.name}'s Profile</Typography>
      <Typography variant="body1"><strong>Email:</strong> {profile.email}</Typography>
      <Typography variant="body1"><strong>Phone:</strong> {profile.phone}</Typography>
      <Typography variant="body1"><strong>Education Level:</strong> {profile.educationLevel}</Typography>
      <Typography variant="body1"><strong>Experience Level:</strong> {profile.experienceLevel}</Typography>
      <Typography variant="body1"><strong>University:</strong> {profile.university}</Typography>
      <Typography variant="body1"><strong>Motivation Letter:</strong> {profile.motivationLetter}</Typography>
      <Typography variant="body1"><strong>Resume:</strong> <a href={`http://localhost:5000/${profile.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
    </Container>
  );
};

export default ViewProfile;
