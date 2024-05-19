// src/Components/Manager_Components/AddJobListingModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddJobListingModal = ({ show, handleClose, fetchJobListings }) => {
    const [jobDetails, setJobDetails] = useState({
        title: '',
        company: '',
        location: '',
        jobType: '',
        description: '',
        requirements: '',
        salaryRange: '',
        experienceLevel: '',
        category: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/jobs', jobDetails);
            fetchJobListings();
            handleClose();
        } catch (error) {
            console.error('Failed to add job listing:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Job Listing</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={jobDetails.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            type="text"
                            name="company"
                            value={jobDetails.company}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={jobDetails.location}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formJobType">
                        <Form.Label>Job Type</Form.Label>
                        <Form.Control
                            type="text"
                            name="jobType"
                            value={jobDetails.jobType}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={jobDetails.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formRequirements">
                        <Form.Label>Requirements</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="requirements"
                            value={jobDetails.requirements}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formSalaryRange">
                        <Form.Label>Salary Range</Form.Label>
                        <Form.Control
                            type="text"
                            name="salaryRange"
                            value={jobDetails.salaryRange}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formExperienceLevel">
                        <Form.Label>Experience Level</Form.Label>
                        <Form.Control
                            type="text"
                            name="experienceLevel"
                            value={jobDetails.experienceLevel}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="category"
                            value={jobDetails.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Web & Mobile Development">Web & Mobile Development</option>
                            <option value="Business Intelligence">Business Intelligence</option>
                            <option value="Digital Marketing & Design">Digital Marketing & Design</option>
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Add Job
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddJobListingModal;
