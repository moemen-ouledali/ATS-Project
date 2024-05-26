// src/Components/User_Components/ViewProfile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Avatar, Grid, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import maleProfilePic from '../../Media/ProfilePicture/male.png';
import femaleProfilePic from '../../Media/ProfilePicture/female.png';

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
        h6: {
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

const ViewProfile = () => {
    const { applicantId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/email/${applicantId}`);
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
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Box sx={{
                    boxShadow: 6,
                    p: 4,
                    m: 2,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.default,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 10,
                    },
                    background: 'linear-gradient(to bottom right, #ffffff, #f0f4f8)',
                    backdropFilter: 'blur(10px)',
                }}>
                    <Grid container spacing={2} direction="column" alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{ width: 150, height: 150, border: '4px solid', borderColor: theme.palette.primary.main }}
                                src={profile.gender === 'male' ? maleProfilePic : femaleProfilePic}
                                alt="Profile Picture"
                            />
                        </Grid>
                        <Grid item>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    {profile.firstName} {profile.lastName}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>Contact Information</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">{profile.phoneNumber || 'Phone number not available'}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">{profile.city || 'City not available'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>Personal Information</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">{profile.dateOfBirth || 'Date of birth not available'}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">{profile.highestEducationLevel || 'Education level not available'}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary">{profile.gender || 'Gender not available'}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ViewProfile;
