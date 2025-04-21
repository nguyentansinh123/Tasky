import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <div className="progress-steps">
      {[...Array(totalSteps)].map((_, index) => (
        <div 
          key={index} 
          className={`step ${index + 1 <= currentStep ? 'active' : ''}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;