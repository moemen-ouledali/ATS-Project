/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Import necessary libraries and components
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react'; // Import React and useState hook for managing state
import { Modal, Button, Form } from 'react-bootstrap'; // Import components from react-bootstrap for UI elements
import axios from 'axios'; // Import axios for making HTTP requests









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the AddJobListingModal component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const AddJobListingModal = ({ show, handleClose, fetchJobListings }) => {
  // Define state for job details using useState hook
  const [jobDetails, setJobDetails] = useState({
    title: '',
    category: '',
    jobLocation: '',
    jobType: '',
    description: '',
    requirements: [],
    experienceLevel: '',
    minimumDegree: '',
  });

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Destructure properties from the event target

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        requirements: checked
          ? [...prevDetails.requirements, value] // Add checked requirement
          : prevDetails.requirements.filter((req) => req !== value), // Remove unchecked requirement
      }));
    } else {



      
      // Handle other input types (text, select)
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };













  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await axios.post('http://localhost:5000/api/jobs/add', jobDetails); // Send job details to the server
      fetchJobListings(); // Refresh job listings
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Failed to add job listing:', error); // Log error if request fails
    }
  };














  // Function to render checkbox options for job requirements based on selected category
  const renderRequirements = () => {
    const requirementsOptions = {
      'Web & Mobile Development': [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP',
        'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'HTML', 'CSS', 'Scala', 'Perl', 'R',
        'Dart', 'MATLAB'
      ],
      'Business Intelligence': [
        'SQL', 'Python', 'R', 'JavaScript', 'SAS', 'Matlab', 'Scala', 'Julia', 'DAX', 
        'MDX', 'VBA', 'T-SQL', 'PL/SQL', 'HiveQL', 'Pig Latin', 'Power Query M', 'Perl',
        'Ruby', 'Go', 'Java'
      ],
      'Digital Marketing & Design': [
        'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch', 'Canva', 'Adobe XD', 
        'HTML', 'CSS', 'JavaScript', 'Google Analytics', 'Google Ads', 'Facebook Ads', 
        'SEO', 'SEM', 'WordPress', 'Mailchimp', 'Hootsuite', 'HubSpot', 'A/B Testing'
      ]
    };













    // Render checkboxes for requirements
    return requirementsOptions[jobDetails.category]?.map((req) => (
      <Form.Check
        key={req} // Unique key for each checkbox
        type="checkbox"
        label={req} // Label displayed next to the checkbox
        name="requirements"
        value={req}
        onChange={handleChange} // Handle change event
        checked={jobDetails.requirements.includes(req)} // Set checkbox checked state
      />
    ));
  };










  // Render the modal component
  return (
    <Modal show={show} onHide={handleClose}> {/* Show or hide modal based on show prop */}
      <Modal.Header closeButton> {/* Modal header with close button */}
        <Modal.Title>Add Job Listing</Modal.Title> {/* Modal title */}
      </Modal.Header>
      <Modal.Body> {/* Modal body containing the form */}
        <Form onSubmit={handleSubmit}> {/* Form to add job listing */}
          <Form.Group controlId="formTitle"> {/* Form group for job title */}
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={jobDetails.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCategory"> {/* Form group for job category */}
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

          <Form.Group controlId="formJobLocation"> {/* Form group for job location */}
            <Form.Label>Job Location</Form.Label>
            <Form.Control
              type="text"
              name="jobLocation"
              value={jobDetails.jobLocation}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formJobType"> {/* Form group for job type */}
            <Form.Label>Job Type</Form.Label>
            <Form.Control
              as="select"
              name="jobType"
              value={jobDetails.jobType}
              onChange={handleChange}
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDescription"> {/* Form group for job description */}
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={jobDetails.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formRequirements"> {/* Form group for job requirements */}
            <Form.Label>Requirements</Form.Label>
            {renderRequirements()} {/* Render requirements checkboxes */}
          </Form.Group>

          <Form.Group controlId="formExperienceLevel"> {/* Form group for experience level */}
            <Form.Label>Experience Level</Form.Label>
            <Form.Control
              as="select"
              name="experienceLevel"
              value={jobDetails.experienceLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience Level</option>
              <option value="0 years">0 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="4-6 years">4-6 years</option>
              <option value="7+ years">7+ years</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formMinimumDegree"> {/* Form group for minimum degree */}
            <Form.Label>Minimum Degree</Form.Label>
            <Form.Control
              as="select"
              name="minimumDegree"
              value={jobDetails.minimumDegree}
              onChange={handleChange}
              required
            >
              <option value="">Select Minimum Degree</option>
              <option value="Licence">Licence</option>
              <option value="Engineering">Engineering</option>
              <option value="Baccalaureate">Baccalaureate</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit"> {/* Button to submit the form */}
            Add Job
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Export the AddJobListingModal component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default AddJobListingModal;
