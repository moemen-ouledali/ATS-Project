import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, MenuItem, FormControl, Select, InputLabel, OutlinedInput } from '@mui/material';
import { AuthContext } from '../../AuthContext'; // Ensure the path is correct

const JobDetailsPage = () => {
    const { id } = useParams(); // This is the jobID
    const { userDetails } = useContext(AuthContext);
    
    const [jobDetails, setJobDetails] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [application, setApplication] = useState({
        jobID: id,
        applicantID: userDetails.userId || '',
        fullName: userDetails.fullName || '',
        age: '',
        educationLevel: '',
        experience: '',
        university: '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        motivationLetter: '',
        resume: null
    });

    // Fetch job details
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJobDetails(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };
        fetchJobDetails();
    }, [id]);

    // Update form fields if userDetails change
    useEffect(() => {
        setApplication(prev => ({
            ...prev,
            applicantID: userDetails.userId || '',
            fullName: userDetails.fullName || '',
            email: userDetails.email || '',
            phoneNumber: userDetails.phoneNumber || ''
        }));
    }, [userDetails]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "resume") {
            setApplication(prev => ({ ...prev, resume: files[0] }));
        } else {
            setApplication(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(application).forEach(key => {
            if (key === 'resume' && application[key]) {
                formData.append(key, application[key], application[key].name);
            } else {
                formData.append(key, application[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/jobapplications/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Server Response:', response);
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Failed to submit application:', error);
            alert('Failed to submit application. Check console for more information.');
        }
    };

    const toggleFormVisibility = () => setShowForm(!showForm);

    return (
        <div>
            <Typography variant="h4" style={{ marginBottom: 20 }}>Apply for {jobDetails.title || 'the position'}</Typography>
            <Typography variant="h6">{jobDetails.description || 'No description available'}</Typography>
            <Button variant="contained" color="primary" onClick={toggleFormVisibility}>Apply Now</Button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <TextField label="Full Name" name="fullName" value={application.fullName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                    <TextField label="Age" name="age" value={application.age} onChange={handleChange} fullWidth margin="normal" type="number" />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Highest Level of Education</InputLabel>
                        <Select value={application.educationLevel} onChange={handleChange} input={<OutlinedInput label="Highest Level of Education" name="educationLevel" />}>
                            <MenuItem value="Baccalaureate">Baccalaureate</MenuItem>
                            <MenuItem value="License">License</MenuItem>
                            <MenuItem value="Engineering">Engineering</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Years of Professional Experience</InputLabel>
                        <Select value={application.experience} onChange={handleChange} input={<OutlinedInput label="Years of Professional Experience" name="experience" />}>
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
            )}
        </div>
    );
};

export default JobDetailsPage;
