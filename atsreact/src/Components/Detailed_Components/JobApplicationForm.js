import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobApplicationForm = () => {
    const { id } = useParams();
    const [application, setApplication] = useState({
        name: '',
        email: '',
        phone: '',
        educationLevel: '',
        experienceLevel: '',
        university: '',
        motivationLetter: '',
        resume: null,
    });

    // Handle input changes for text inputs and file input
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'resume') {
            setApplication(prev => ({ ...prev, resume: files[0] }));
        } else {
            setApplication(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(application).forEach(key => {
            if (key === 'resume' && application[key] !== null) {
                formData.append(key, application[key], application[key].name);
            } else {
                formData.append(key, application[key]);
            }
        });
        formData.append('jobId', id);
    
        // Debugging: Log FormData values
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    
        axios.post('http://localhost:5000/api/apply', formData)
        .then(response => {
            alert('Application submitted successfully!');
        })
        .catch(error => {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please try again.');
        });
    };

    return (
        <div>
            <h1>Apply for the Job</h1>
            <form onSubmit={handleSubmit}>
                <label>Name: <input type="text" name="name" value={application.name} onChange={handleChange} /></label>
                <label>Email: <input type="email" name="email" value={application.email} onChange={handleChange} /></label>
                <label>Phone: <input type="text" name="phone" value={application.phone} onChange={handleChange} /></label>
                <label>Education Level:
                    <select name="educationLevel" value={application.educationLevel} onChange={handleChange}>
                        <option value="">Select Education Level</option>
                        <option value="licence">Licence</option>
                        <option value="engineering">Engineering</option>
                        <option value="doctorate">Doctorate</option>
                    </select>
                </label>
                <label>Experience Level:
                    <select name="experienceLevel" value={application.experienceLevel} onChange={handleChange}>
                        <option value="">Select Experience Level</option>
                        <option value="0 years">0 years</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="4-6 years">4-6 years</option>
                        <option value="7+ years">7+ years</option>
                    </select>
                </label>
                <label>University: <input type="text" name="university" value={application.university} onChange={handleChange} /></label>
                <label>Motivation Letter: <textarea name="motivationLetter" value={application.motivationLetter} onChange={handleChange} /></label>
                <label>Resume (PDF only): <input type="file" name="resume" onChange={handleChange} accept="application/pdf" /></label>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default JobApplicationForm;
