import React, { useState } from 'react';
import '../css/CreateTask.css';

const CreateTaskStep2 = ({ onNext, onBack }) => {
  const [details, setDetails] = useState({
    description: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="task-content">
        <h2 className="section-title createTaskTitle">Tell us more about your task</h2>

        <div className="form-group">
          <label className="form-label">
            Describe what needs to be done in detail
          </label>
          <textarea
            className="task-input"
            name="description"
            placeholder="e.g. I need help moving a 3-seater sofa from my living room to my new apartment..."
            value={details.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Where does this need to be done?
          </label>
          <input 
            type="text" 
            className="task-input"
            name="location"
            placeholder="Enter address or location"
            value={details.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="navigation-buttons">
        <button type="button" className="nav-button back-button" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="nav-button next-button">
          Next
        </button>
      </div>
    </form>
  );
};

export default CreateTaskStep2;