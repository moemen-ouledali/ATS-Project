import React, { useState, useEffect, useContext } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import { AuthContext } from '../../AuthContext'; // Import authentication context

// Import Material-UI components
import { 
    Container, Box, Typography, TextField, Button, IconButton, Avatar, Grid, 
    MenuItem, Divider, Modal, Alert, CircularProgress, Slide, Fade 
} from '@mui/material';

// Import Material-UI icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Import theme creation utilities from Material-UI
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import profile pictures
import maleProfilePic from '../../Media/ProfilePicture/male.png';
import femaleProfilePic from '../../Media/ProfilePicture/female.png';











// Define a custom theme
const theme = createTheme({
    palette: {
        primary: { main: '#4A90E2' }, // Primary color
        secondary: { main: '#50E3C2' }, // Secondary color
        background: { default: '#f7f9fc' }, // Background color
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif', // Default font
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










// Style object for the modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};










const EditProfileForm = () => {





    // Extract authentication token and user ID from the AuthContext
    const { authToken, userId } = useContext(AuthContext);











    // State to store user details
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        dateOfBirth: '',
        highestEducationLevel: '',
        gender: '',
    });

    const [editMode, setEditMode] = useState(false); // State to toggle edit mode
    const [showPasswordModal, setShowPasswordModal] = useState(false); // State to toggle password modal
    const [currentPassword, setCurrentPassword] = useState(''); // State for current password
    const [newPassword, setNewPassword] = useState(''); // State for new password
    const [confirmNewPassword, setConfirmNewPassword] = useState(''); // State to confirm new password
    const [message, setMessage] = useState(''); // State for success message
    const [error, setError] = useState(''); // State for error message
    const [loading, setLoading] = useState(true); // State to indicate loading













    // Fetch user details when the component mounts or userId changes
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
                    highestEducationLevel: response.data.highestEducationLevel,
                    gender: response.data.gender,
                });
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                alert('Failed to load your profile data.');
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);










    // Handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };











    // Handle form submission to update user details
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/auth/user/${userId}`, userDetails, {
            headers: { Authorization: `Bearer ${authToken}` },
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











    // Toggle edit mode
    const handleEditClick = () => {
        setEditMode(true);
    };










    // Handle password change submission
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
                newPassword,
            }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setMessage(response.data.message);
            setError('');
            setShowPasswordModal(false);
        } catch (err) {
            setError('Failed to change password. Please try again.');
            console.error('Password change error:', err);
        }
    };












    // Open and close password modal
    const openPasswordModal = () => setShowPasswordModal(true);
    const closePasswordModal = () => setShowPasswordModal(false);







    
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
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
                                        src={userDetails.gender === 'male' ? maleProfilePic : femaleProfilePic}
                                        alt="Profile Picture"
                                    />
                                </Grid>
                                <Grid item>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 3 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
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
                                            <Typography variant="body2" color="textSecondary">{userDetails.email}</Typography>
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
                                            <Typography variant="body2" color="textSecondary">{userDetails.phoneNumber}</Typography>
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
                                            <Typography variant="body2" color="textSecondary">{userDetails.city}</Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                            <Typography variant="body2" color="textSecondary">{userDetails.dateOfBirth}</Typography>
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
                                            <Typography variant="body2" color="textSecondary">{userDetails.highestEducationLevel}</Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        {editMode ? (
                                            <TextField
                                                name="gender"
                                                value={userDetails.gender}
                                                onChange={handleChange}
                                                label="Gender"
                                                select
                                                fullWidth
                                                margin="dense"
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                            </TextField>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">{userDetails.gender}</Typography>
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
                    </Slide>
                )}
            </Container>
            <Modal open={showPasswordModal} onClose={closePasswordModal}>
                <Fade in={showPasswordModal}>
                    <Box sx={{ ...style, p: 4, boxShadow: 24, borderRadius: 3 }}>
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
                </Fade>
            </Modal>
        </ThemeProvider>
    );
};

export default EditProfileForm;
