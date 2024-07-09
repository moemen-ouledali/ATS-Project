import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Card, CardContent, Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../assets/css/LoginForm.css';

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

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    role: 'Candidate',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    phoneNumber: '',
    city: '',
    highestEducationLevel: 'Baccalaureate',
    gender: ''
  });
  const [message, setMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, dateOfBirth, password, phoneNumber } = userData;
    const nameRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    const phoneRegex = /^\d{1,8}$/;
    const errors = [];

    if (!nameRegex.test(firstName)) {
      errors.push("First name can't contain numbers.");
    }
    if (!nameRegex.test(lastName)) {
      errors.push("Last name can't contain numbers.");
    }
    const dob = new Date(dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    if (Math.abs(ageDate.getUTCFullYear() - 1970) < 18) {
      errors.push("You must be at least 18 years old.");
    }
    if (!passwordRegex.test(password)) {
      errors.push("Password must contain at least 1 uppercase, 1 lowercase, and 1 special character.");
    }
    if (!phoneRegex.test(phoneNumber)) {
      errors.push("Phone number must be only a number and maximum 8 digits.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const response = await axios.post('https://ats-project-1.onrender.com/auth/register', userData);
      setMessage(response.data.message);
      setIsVerifying(true);
      setErrorMessages([]); // Clear error messages if registration is successful
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ats-project-1.onrender.com/auth/verify-code', { email: userData.email, code: verificationCode });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.");
      console.error("Verification error:", error);
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
