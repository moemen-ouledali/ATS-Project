import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import '../Add-Ons/toast-notification-01/style.css';

const AddJobListing = () => {
    const { authToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        jobType: '',
        description: '',
        requirements: '',
        salaryRange: '',
        experienceLevel: '',
        category: '', // Add category to the form state

    });
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/joblistings/add', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            console.log('Job listing added:', response.data);
            showNotification();
            // Reset the form fields after successful submission
            setFormData({
                title: '',
                company: '',
                location: '',
                jobType: '',
                description: '',
                requirements: '',
                salaryRange: '',
                experienceLevel: '',
                category: '', // Reset category as well
            });
        } catch (error) {
            console.error('Failed to add job listing:', error);
        }
    };

    return (
        <div>
            <h2>Add Job Listing</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" required />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                {/* Updated jobType input */}
                <select name="jobType" value={formData.jobType} onChange={handleChange} required>
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                </select>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" required />
                <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements" />
                <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="Salary Range" />
                <input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} placeholder="Experience Level" />
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Web & Mobile Development">Web & Mobile Development</option>
                    <option value="Business Intelligence">Business Intelligence</option>
                    <option value="Digital Marketing & Design">Digital Marketing & Design</option>
                </select>
                <button type="submit">Submit</button>
            </form>
            {showToast && <div className="notification">
                <div className="notification__body">
                    ✅ Job listing added successfully! 🚀
                </div>
            </div>}
        </div>
    );    
};

export default AddJobListing;
