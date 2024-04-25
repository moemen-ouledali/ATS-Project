import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const JobApplicationForm = () => {
    const { id } = useParams();
    const [application, setApplication] = useState({
        name: '',
        email: '',
        resume: null,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'resume') {
            setApplication(prev => ({ ...prev, resume: files[0] }));
        } else {
            const { value } = e.target;
            setApplication(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', application.name);
            formData.append('email', application.email);
            formData.append('resume', application.resume, application.resume.name);
            formData.append('jobId', id);
    
            const response = await axios.post('http://localhost:5000/api/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            if (response.status === 201) {
                alert('Application submitted successfully!');
            } else {
                alert('Failed to submit application. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please try again.');
        }
    };
    
    
    return (
        <div>
            <h1>Apply for the Job</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={application.name} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={application.email} onChange={handleChange} />
                </label>
                <label>
                    Resume (PDF only):
                    <input type="file" name="resume" onChange={handleChange} accept="application/pdf" />
                </label>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default JobApplicationForm;