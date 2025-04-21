import React from 'react';
import '../pages/css/TaskPlatform.css';

const TaskPlatform = () => {
  return (
    <div className="task-platform-container">
      <div className="content-column">
        <header className="platform-header">
          <h1 className="platform-title">Task you need to complete ...</h1>
          <p className="platform-subtitle">
            The only platform that gives your team all the tools needed to work together on their awesome projects.
          </p>
          
          <div className="signup-form">
            <input 
              type="email" 
              placeholder="Enter work email" 
              className="email-input"
            />
            <button className="signup-button">Sign Up Free</button>
          </div>
        </header>
      </div>
      
      <div className="image-column">
        <div className="placeholder-image"></div>
      </div>
    </div>
  );
};

export default TaskPlatform;