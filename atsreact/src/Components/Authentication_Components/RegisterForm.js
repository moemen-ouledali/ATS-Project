import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Card, CardContent, Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../assets/css/LoginForm.css'; // Importing custom CSS for styling



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a custom theme for Material-UI components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Main color for primary elements
    },
    secondary: {
      main: '#50E3C2', // Main color for secondary elements
    },
    background: {
      default: '#f7f9fc', // Background color for the app
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Font family for text
    h4: {
      fontWeight: 800,
      color: '#333',
      fontSize: '2rem', // Font size for h4 headers
    },
    h5: {
      fontWeight: 700,
      color: '#555',
      fontSize: '1.5rem', // Font size for h5 headers
    },
    body2: {
      color: '#777',
      fontSize: '1rem', // Font size for body text
    },
    button: {
      textTransform: 'uppercase', // Uppercase text for buttons
      fontWeight: 700,
      fontSize: '0.875rem', // Font size for button text
    },
  },
});










const RegisterForm = () => {













  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // State to hold user input data
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [userData, setUserData] = useState({
    role: 'Candidate', // Default role is 'Candidate'
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    phoneNumber: '',
    city: '',
    highestEducationLevel: 'Baccalaureate', // Default education level
    gender: ''
  });







  // State to hold messages and error messages
  const [message, setMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate(); // Hook to navigate between pages












  // Function to handle changes in input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value // Update the state with new input value
    }));
  };








  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function to validate the form before submission
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const validateForm = () => {
    const { firstName, lastName, dateOfBirth, password, phoneNumber } = userData;
    const nameRegex = /^[A-Za-z]+$/; // Regex for names (letters only)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/; // Regex for passwords (at least 1 uppercase, 1 lowercase, 1 special character, and 8 characters long)
    const phoneRegex = /^\d{1,8}$/; // Regex for phone numbers (only digits, max 8 digits)
    const errors = [];

    // Validate first name
    if (!nameRegex.test(firstName)) {
      errors.push("First name can't contain numbers.");
    }

    // Validate last name
    if (!nameRegex.test(lastName)) {
      errors.push("Last name can't contain numbers.");
    }

    // Validate age (must be at least 18 years old)
    const dob = new Date(dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    if (Math.abs(ageDate.getUTCFullYear() - 1970) < 18) {
      errors.push("You must be at least 18 years old.");
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      errors.push("Password must contain at least 1 uppercase, 1 lowercase, and 1 special character.");
    }

    // Validate phone number
    if (!phoneRegex.test(phoneNumber)) {
      errors.push("Phone number must be only a number and maximum 8 digits.");
    }

    return errors; // Return any validation errors
  };













  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function to handle form submission
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const errors = validateForm(); // Validate the form
    if (errors.length > 0) {
      setErrorMessages(errors); // Set error messages if there are validation errors
      return;
    }

    try {
      // Send a POST request to the server to register the user
      const response = await axios.post('http://localhost:5000/auth/register', userData);
      setMessage(response.data.message); // Set the success message
      setIsVerifying(true); // Switch to verification mode
      setErrorMessages([]); // Clear error messages if registration is successful
    } catch (error) {
      setMessage("Registration failed. Please try again."); // Set the error message
      console.error("Registration error:", error); // Log the error to the console
    }
  };









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Function to handle verification code submission
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleVerifyCode = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send a POST request to the server to verify the code
      const response = await axios.post('http://localhost:5000/auth/verify-code', { email: userData.email, code: verificationCode });
      setMessage(response.data.message); // Set the success message
      if (response.status === 200) {
        navigate('/login'); // Redirect to the login page on successful verification
      }
    } catch (error) {
      setMessage("Verification failed. Please try again."); // Set the error message
      console.error("Verification error:", error); // Log the error to the console
    }
  };













  
  return (
    <ThemeProvider theme={theme}>
      <section className="vh-100 flex items-center justify-center bg-gray-100">
        <Container maxWidth="lg">
          <Card sx={{ boxShadow: 3, p: 4 }}>
            <CardContent>
              <div className="text-center mb-4">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Sample" className="img-fluid mb-3" />
                <Typography variant="h4" gutterBottom>
                  Register
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Sign up to create an account
                </Typography>
              </div>
              {!isVerifying ? (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        name="firstName" 
                        label="First Name" 
                        value={userData.firstName} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal" 
                        required 
                      />
                      <TextField 
                        name="lastName" 
                        label="Last Name" 
                        value={userData.lastName} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal" 
                        required 
                      />
                      <TextField 
                        name="email" 
                        label="Email Address" 
                        type="email" 
                        value={userData.email} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal" 
                        required 
                      />
                      <TextField 
                        name="dateOfBirth" 
                        label="Date of Birth" 
                        type="date" 
                        InputLabelProps={{ shrink: true }} 
                        value={userData.dateOfBirth} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal" 
                        required 
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField 
                        name="password" 
                        label="Password" 
                        type="password" 
                        value={userData.password} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal" 
                        required 
                      />
                      <TextField 
                        name="phoneNumber" 
                        label="Phone Number" 
                        value={userData.phoneNumber} 
                        onChange={handleChange} 
                        fullWidth 
                        margin="normal" 
                        required 
                      />
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>City</InputLabel>
                        <Select
                          name="city"
                          value={userData.city}
                          onChange={handleChange}
                        >
                          <MenuItem value="">Select a governorate</MenuItem>
                          {[
                            'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Kef', 
                            'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 
                            'Tozeur', 'Tunis', 'Zaghouan'
                          ].map(city => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>Highest Education Level</InputLabel>
                        <Select
                          name="highestEducationLevel"
                          value={userData.highestEducationLevel}
                          onChange={handleChange}
                        >
                          <MenuItem value="Baccalaureate">Baccalaureate</MenuItem>
                          <MenuItem value="Licence">Licence</MenuItem>
                          <MenuItem value="Engineering">Engineering</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={userData.gender}
                          onChange={handleChange}
                        >
                          <MenuItem value="">Select Gender</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Register
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Already have an account? <a href="/login" style={{ color: theme.palette.primary.main }}>Login</a>
                    </Typography>
                  </Box>
                  {errorMessages.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      {errorMessages.map((error, index) => (
                        <Typography key={index} color="error">{error}</Typography>
                      ))}
                    </Box>
                  )}
                </form>
              ) : (
                <form onSubmit={handleVerifyCode}>
                  <TextField 
                    name="verificationCode" 
                    label="Verification Code" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                    required 
                  />
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Verify
                    </Button>
                  </Box>
                  {message && <Box sx={{ mt: 2 }}><Typography color="error">{message}</Typography></Box>}
                </form>
              )}
            </CardContent>
          </Card>
        </Container>
      </section>
    </ThemeProvider>
  );
};

export default RegisterForm;
