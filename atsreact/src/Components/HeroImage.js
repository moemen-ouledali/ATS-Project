import React from 'react';

const HeroImage = () => {
  const heroImageStyle = {
    height: '50%',
    background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../Media/management.png')",
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
  };

  const heroTextStyle = {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
  };

  const heroTitleStyle = {
    fontSize: '50px',
  };

  const buttonStyle = {
    border: 'none',
    outline: 0,
    display: 'inline-block',
    padding: '10px 25px',
    color: 'black',
    backgroundColor: '#ddd',
    textAlign: 'center',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#555',
    color: 'white',
  };

  return (
    <div style={heroImageStyle}>
      <div style={heroTextStyle}>
        <h1 style={heroTitleStyle}>I am John Doe</h1>
        <p>And I'm a Photographer</p>
        <button style={buttonStyle} onMouseOver={(e) => e.currentTarget.style = buttonHoverStyle} onMouseOut={(e) => e.currentTarget.style = buttonStyle}>Hire me</button>
      </div>
    </div>
  );
};

export default HeroImage;
