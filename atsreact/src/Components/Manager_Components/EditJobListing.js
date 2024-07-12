import React, { useState } from 'react'; // Import React and useState hook from 'react'
import { Button, Form, Card } from 'react-bootstrap'; // Import Button, Form, and Card components from 'react-bootstrap'
import { Save, Cancel } from '@mui/icons-material'; // Import Save and Cancel icons from '@mui/icons-material'

















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Edit Job Listing Component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const EditJobListing = ({ listing, onSave, onCancel }) => {
  // Initialize state for job details, using the provided listing as the initial state
  const [jobDetails, setJobDetails] = useState({ ...listing });

  // Function to handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Destructure properties from the event target
    if (type === 'checkbox') {
      // Handle checkbox changes
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        requirements: checked
          ? [...prevDetails.requirements, value] // Add requirement if checked
          : prevDetails.requirements.filter((req) => req !== value), // Remove requirement if unchecked
      }));
    } else {
      // Handle other input changes
      setJobDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value, // Update the respective field in job details
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    onSave(listing._id, jobDetails); // Call onSave with the listing ID and updated job details
  };

  // Function to render requirement checkboxes based on the selected category
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

    // Map over the requirements options and create a checkbox for each requirement
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













  

  return (
    <Card.Body as="form" onSubmit={handleSubmit}>
      {/* Form group for job title */}
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

      {/* Form group for job category */}
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

      {/* Form group for job location */}
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

      {/* Form group for job type */}
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

      {/* Form group for job description */}
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

      {/* Form group for job requirements */}
      <Form.Group controlId="formRequirements">
        <Form.Label>Requirements</Form.Label>
        {renderRequirements()}
      </Form.Group>

      {/* Form group for experience level */}
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

      {/* Form group for minimum degree */}
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



      {/* Card footer with Save and Cancel buttons */}
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

export default EditJobListing; // Export the EditJobListing component
