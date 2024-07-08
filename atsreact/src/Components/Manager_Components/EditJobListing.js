// Import necessary libraries and components
import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { Save, Cancel } from '@mui/icons-material';









// Define the EditJobListing component, which accepts props: listing, onSave, and onCancel
const EditJobListing = ({ listing, onSave, onCancel }) => {
  // Initialize state to hold job details with the values from the listing prop
  const [jobDetails, setJobDetails] = useState({ ...listing });











  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;










    if (type === 'checkbox') {
      // Update requirements array for checkbox inputs
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        requirements: checked
          ? [...prevDetails.requirements, value]
          : prevDetails.requirements.filter((req) => req !== value),
      }));
    } 
    
    
    
    
    
    
    else {
      // Update state for other input types
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };









  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    onSave(listing._id, jobDetails); // Call onSave prop with the listing ID and updated job details
  };








  // Render checkbox options for requirements based on selected category
  const renderRequirements = () => {











    // Define options for each category
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












    // Return checkbox inputs for the selected category
    return requirementsOptions[jobDetails.category]?.map((req) => (
      <Form.Check
        key={req}
        type="checkbox"
        label={req}
        name="requirements"
        value={req}
        onChange={handleChange}
        checked={jobDetails.requirements.includes(req)}
      />
    ));
  };



















  // Return the JSX to render the form for editing a job listing
  return (
    <Card.Body as="form" onSubmit={handleSubmit}>
      {/* Job Title Input */}
      <Form.Group controlId="formTitle">
        <Form.Label>Job Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={jobDetails.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Category Select */}
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

      {/* Job Location Input */}
      <Form.Group controlId="formJobLocation">
        <Form.Label>Job Location</Form.Label>
        <Form.Control
          type="text"
          name="jobLocation"
          value={jobDetails.jobLocation}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Job Type Select */}
      <Form.Group controlId="formJobType">
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

      {/* Description Textarea */}
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

      {/* Requirements Checkboxes */}
      <Form.Group controlId="formRequirements">
        <Form.Label>Requirements</Form.Label>
        {renderRequirements()}
      </Form.Group>

      {/* Experience Level Select */}
      <Form.Group controlId="formExperienceLevel">
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

      {/* Minimum Degree Select */}
      <Form.Group controlId="formMinimumDegree">
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

      {/* Form Buttons */}
      <Card.Footer>
        <Button
          type="submit"
          variant="primary"
          startIcon={<Save />}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          startIcon={<Cancel />}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Card.Footer>
    </Card.Body>
  );
};

// Export the EditJobListing component for use in other parts of the application
export default EditJobListing;
