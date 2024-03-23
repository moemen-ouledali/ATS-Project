import React, { useState } from 'react';

const EditJobListing = ({ listing, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...listing });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(listing._id, formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
            </label>
            <label>
                Company:
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                />
            </label>
            <label>
                Location:
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
            </label>
            <label>
                Job Type:
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                    <option value="">Select a type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                </select>
            </label>
            <label>
                Description:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>
            <label>
                Requirements:
                <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                />
            </label>
            <label>
                Salary Range:
                <input
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                />
            </label>
            <label>
                Experience Level:
                <input
                    type="text"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default EditJobListing;
