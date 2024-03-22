import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Import AuthContext to access the authToken

const AddJobListing = () => {
    const { authToken } = useContext(AuthContext); // Use AuthContext to get the authToken
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        jobType: '',
        description: '',
        requirements: '',
        salaryRange: '',
        experienceLevel: '',
    });

    // Update form state when input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit form data to server
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/joblistings/add', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Include the authToken in the authorization header
                },
            });
            console.log('Job listing added:', response.data);
            // Optionally reset form here or give user feedback
            setFormData({
                title: '',
                company: '',
                location: '',
                jobType: '',
                description: '',
                requirements: '',
                salaryRange: '',
                experienceLevel: '',
            });
        } catch (error) {
            console.error('Failed to add job listing:', error);
            // Optionally give user feedback on failure
        }
    };

    // The form component
    return (
        <div>
            <h2>Add Job Listing</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" required />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                <input type="text" name="jobType" value={formData.jobType} onChange={handleChange} placeholder="Job Type" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" required />
                <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements" />
                <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="Salary Range" />
                <input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} placeholder="Experience Level" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddJobListing;
