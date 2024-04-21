import React, { useState, useEffect, useContext, } from 'react';

import { TextField, Button, Typography, MenuItem, FormControl, Select, InputLabel, OutlinedInput, } from '@mui/material';
import { AuthContext } from '../../AuthContext'; // Adjust the path if necessary
import axios from 'axios'; // Ensure axios is imported for API requests

const JobApplicationForm = ({ jobId }) => {
    const { userDetails } = useContext(AuthContext);
    console.log("Current User Details:", userDetails); // Add this line to log userDetails
    const [application, setApplication] = useState({
        jobID: jobId,
        applicantID: userDetails.userId || '',
        fullName: userDetails.fullName || '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        age: '',
        educationLevel: '',
        experience: '',
        university: '',
        motivationLetter: '',
        resume: null
    });

    useEffect(() => {
        if (userDetails && userDetails.userId) {
            console.log("User details updated in form:", userDetails);
            setApplication(prev => ({

                ...prev,
            applicantID: userDetails.userId,
            fullName: userDetails.fullName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber
            }));
        } else {
            console.log("No userDetails found, check AuthContext or login state.");
        }
    }, [userDetails]);
    

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setApplication(prev => ({ ...prev, [name]: value, resume: name === 'resume' ? files[0] : prev.resume }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting application with the following details:", application);
        
        const formData = new FormData();
        Object.keys(application).forEach(key => {
            formData.append(key, application[key]);
        });

        try {
            const response = await axios.post('http://localhost:5000/api/jobapplications/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Server Response:', response);
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Failed to submit application:', error);
            alert('Failed to submit application. Check console for more information.');
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Apply for a Job</Typography>
            <form onSubmit={handleSubmit}>
                <TextField label="Full Name" name="fullName" value={application.fullName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                <TextField label="Age" name="age" value={application.age} onChange={handleChange} fullWidth margin="normal" type="number" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Highest Level of Education</InputLabel>
                    <Select name="educationLevel" value={application.educationLevel} onChange={handleChange} input={<OutlinedInput label="Highest Level of Education" />}>
                        <MenuItem value="Baccalaureate">Baccalaureate</MenuItem>
                        <MenuItem value="License">License</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Years of Professional Experience</InputLabel>
                    <Select name="experience" value={application.experience} onChange={handleChange} input={<OutlinedInput label="Years of Professional Experience" />}>
                        <MenuItem value="0">0</MenuItem>
                        <MenuItem value="1-3">1-3</MenuItem>
                        <MenuItem value="4-6">4-6</MenuItem>
                        <MenuItem value="7+">7+</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="University" name="university" value={application.university} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Email Address" name="email" value={application.email} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                <TextField label="Phone Number" name="phoneNumber" value={application.phoneNumber} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Motivation Letter" name="motivationLetter" value={application.motivationLetter} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                <Button variant="contained" component="label" style={{ marginTop: 20, marginBottom: 20 }}>
                    Upload Resume (PDF)
                    <input type="file" name="resume" hidden accept=".pdf" onChange={handleChange} />
                </Button>
                <Button type="submit" variant="contained" color="primary" fullWidth>Submit Application</Button>
            </form>
        </div>
    );
};

export default JobApplicationForm;
