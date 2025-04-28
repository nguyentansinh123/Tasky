import React from "react";

const ProgressBar = ({ currentStep, totalSteps, isSubmitting = false }) => {
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
      
      {isSubmitting && (
        <div className="submission-indicator">
          <div className="spinner"></div>
          <span>Creating your task...</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;