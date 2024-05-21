import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import { Container, Box, Typography, TextField, Button, IconButton, Avatar, Grid, MenuItem, Divider, Modal, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#d32f2f',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
        },
    },
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const EditProfileForm = () => {
    const { authToken, userId, userDetails: authUserDetails } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        dateOfBirth: '',
        highestEducationLevel: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) {
            console.error("User ID is null");
            return;
        }
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/auth/user/${userId}`);
                setUserDetails({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    city: response.data.city,
                    dateOfBirth: response.data.dateOfBirth.split('T')[0],
                    highestEducationLevel: response.data.highestEducationLevel
                });
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                alert('Failed to load your profile data.');
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/auth/user/${userId}`, userDetails, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(response => {
            alert('Profile updated successfully!');
            setEditMode(false);
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        });
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/auth/change-password', {
                userId,
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setMessage(response.data.message);
            setError('');
            setShowPasswordModal(false);
        } catch (err) {
            setError('Failed to change password. Please try again.');
            console.error('Password change error:', err);
        }
    };
    

    const openPasswordModal = () => setShowPasswordModal(true);
    const closePasswordModal = () => setShowPasswordModal(false);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} disableGutters>
                <Box sx={{ boxShadow: 3, p: 4, m: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3} md={2}>
                            <Avatar sx={{ width: 150, height: 150 }}>U</Avatar>
                        </Grid>
                        <Grid item xs={12} sm={9} md={10}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {editMode ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                name="firstName"
                                                value={userDetails.firstName}
                                                onChange={handleChange}
                                                label="First Name"
                                                fullWidth
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                name="lastName"
                                                value={userDetails.lastName}
                                                onChange={handleChange}
                                                label="Last Name"
                                                fullWidth
                                                margin="dense"
                                            />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    `${userDetails.firstName} ${userDetails.lastName}`
                                )}
                            </Typography>
                            {!editMode && (
                                <IconButton color="primary" onClick={handleEditClick} sx={{ mt: 2 }}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" gutterBottom>Contact Information</Typography>
                            <Box sx={{ mb: 2 }}>
                                {editMode ? (
                                    <TextField
                                        name="email"
                                        value={userDetails.email}
                                        onChange={handleChange}
                                        label="Email"
                                        fullWidth
                                        margin="dense"
                                    />
                                ) : (
                                    <Typography variant="body1" color="textSecondary">{userDetails.email}</Typography>
                                )}
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                {editMode ? (
                                    <TextField
                                        name="phoneNumber"
                                        value={userDetails.phoneNumber}
                                        onChange={handleChange}
                                        label="Phone Number"
                                        fullWidth
                                        margin="dense"
                                    />
                                ) : (
                                    <Typography variant="body1" color="textSecondary">{userDetails.phoneNumber}</Typography>
                                )}
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                {editMode ? (
                                    <TextField
                                        name="city"
                                        value={userDetails.city}
                                        onChange={handleChange}
                                        label="City"
                                        fullWidth
                                        margin="dense"
                                    />
                                ) : (
                                    <Typography variant="body1" color="textSecondary">{userDetails.city}</Typography>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" gutterBottom>Personal Information</Typography>
                            <Box sx={{ mb: 2 }}>
                                {editMode ? (
                                    <TextField
                                        name="dateOfBirth"
                                        type="date"
                                        value={userDetails.dateOfBirth}
                                        onChange={handleChange}
                                        label="Date of Birth"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        margin="dense"
                                    />
                                ) : (
                                    <Typography variant="body1" color="textSecondary">{userDetails.dateOfBirth}</Typography>
                                )}
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                {editMode ? (
                                    <TextField
                                        name="highestEducationLevel"
                                        value={userDetails.highestEducationLevel}
                                        onChange={handleChange}
                                        label="Highest Education Level"
                                        select
                                        fullWidth
                                        margin="dense"
                                    >
                                        <MenuItem value="Baccalaureate">Baccalaureate</MenuItem>
                                        <MenuItem value="Licence">Licence</MenuItem>
                                        <MenuItem value="Engineering">Engineering</MenuItem>
                                    </TextField>
                                ) : (
                                    <Typography variant="body1" color="textSecondary">{userDetails.highestEducationLevel}</Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    {editMode && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<SaveIcon />}>
                                Save Changes
                            </Button>
                        </Box>
                    )}
                    {!editMode && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button variant="contained" color="primary" onClick={openPasswordModal}>
                                Change Password
                            </Button>
                        </Box>
                    )}
                </Box>
            </Container>
            <Modal open={showPasswordModal} onClose={closePasswordModal}>
                <Box sx={{ ...style }}>
                    <Typography variant="h6" gutterBottom>Change Password</Typography>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handlePasswordChange}
                    >
                        Reset Password
                    </Button>
                    {message && <Alert variant="filled" severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                    {error && <Alert variant="filled" severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </Box>
            </Modal>
        </ThemeProvider>
    );
};

export default EditProfileForm;
