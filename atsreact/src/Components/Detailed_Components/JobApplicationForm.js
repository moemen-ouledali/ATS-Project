import React, { useState, useEffect } from 'react';
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

    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/jobs/${id}`)
            .then(response => setJobDetails(response.data))
            .catch(error => {
                console.error('Error fetching job details:', error);
                alert('Failed to fetch job details.');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'resume') {
            setApplication(prev => ({ ...prev, resume: files[0] }));
        } else {
            setApplication(prev => ({ ...prev, [name]: e.target.value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(application).forEach(key => {
            if (key === 'resume' && application[key]) {
                formData.append(key, application[key], application[key].name);
            } else {
                formData.append(key, application[key]);
            }
        });
        formData.append('jobId', id);
    
        axios.post('http://localhost:5000/api/jobapplications', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('Application submitted successfully!');
        })
        .catch(error => {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please check the console for more details.');
        });
    };
    

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center' }}>Apply for the Job</h1>
            {jobDetails ? (
                <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '5px' }}>
                    <h2>{jobDetails.title}</h2>
                    <p><strong>Company:</strong> {jobDetails.company}</p>
                    <p><strong>Description:</strong> {jobDetails.description}</p>
                    <p><strong>Location:</strong> {jobDetails.location}</p>
                    <p><strong>Type:</strong> {jobDetails.jobType}</p>
                    <p><strong>Requirements:</strong> {jobDetails.requirements}</p>
                    <p><strong>Salary Range:</strong> {jobDetails.salaryRange}</p>
                    <p><strong>Experience Required:</strong> {jobDetails.experienceLevel}</p>
                    <p><strong>Category:</strong> {jobDetails.category}</p>
                </div>
            ) : <p>Loading job details...</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name: <input type="text" name="name" value={application.name} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email: <input type="email" name="email" value={application.email} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Phone: <input type="text" name="phone" value={application.phone} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Education Level:
                        <select name="educationLevel" value={application.educationLevel} onChange={handleChange} style={{ width: '100%' }}>
                            <option value="">Select Education Level</option>
                            <option value="licence">Licence</option>
                            <option value="engineering">Engineering</option>
                            <option value="doctorate">Doctorate</option>
                        </select>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Experience Level:
                        <select name="experienceLevel" value={application.experienceLevel} onChange={handleChange} style={{ width: '100%' }}>
                            <option value="">Select Experience Level</option>
                            <option value="0 years">0 years</option>
                            <option value="1-3 years">1-3 years</option>
                            <option value="4-6 years">4-6 years</option>
                            <option value="7+ years">7+ years</option>
                        </select>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>University: <input type="text" name="university" value={application.university} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Motivation Letter: <textarea name="motivationLetter" value={application.motivationLetter} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Resume (PDF only): <input type="file" name="resume" onChange={handleChange} accept="application/pdf" /></label>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit Application</button>
            </form>
        </div>
    );
};

export default JobApplicationForm;
