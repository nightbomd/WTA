import React from 'react';

export default function DonutComponent({ value }) {
  // Ensure the value stays between 0 and 100
  const percentage = Math.min(Math.max(value, 0), 50);
  
  // Calculate the degree equivalent of the percentage (360 degrees * percentage / 100)
  const fillDegrees = (percentage / 100) * 360;

  const styles = {
    outerContainer: {
      backgroundColor: '#231F1F', 
      width: '400px',
      height: '400px',
    },
    outerCircle: {
      /* Using conic-gradient to create the fill effect.
        - The blue fill runs from 0deg up to fillDegrees.
        - The remaining track becomes the dark background (#0c0c0c) from fillDegrees to 360deg.
      */
      background: `conic-gradient(
        #007bff 0deg, 
        #3f72be 50%, 
        #2c6cc5 ${fillDegrees}deg, 
        #0c0c0c ${fillDegrees}deg 360deg
      )`,
      width: '250px',
      height: '250px',
      transition: 'background 0.3s ease', // Smooth transition if the value changes dynamically
    },
    innerCircle: {
      backgroundColor: '#231F1F', // Matches the main box to look like a hollow cutout
      width: '160px',
      height: '160px',
      color: '#ffffff',
      fontSize: '2.5rem',
      fontWeight: '300', 
      textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      {/* 1. Main Background Box */}
      <div 
        style={styles.outerContainer} 
        className="d-flex justify-content-center align-items-center rounded-3"
      >
        {/* 2. Outer Ring (Acts as the progress bar track) */}
        <div 
          style={styles.outerCircle} 
          className="d-flex justify-content-center align-items-center rounded-circle"
        >
          {/* 3. Inner Center Circle (Masks the center to form the "donut") */}
          <div 
            style={styles.innerCircle} 
            className="d-flex justify-content-center align-items-center rounded-circle"
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}