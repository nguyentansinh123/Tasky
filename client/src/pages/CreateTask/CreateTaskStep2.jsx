import React, { useEffect, useRef } from 'react';
import '../css/CreateTask.css';
import { useTaskStore } from '../../store/useTaskStore';

const CreateTaskStep2 = ({ onNext, onBack }) => {
  const { taskForm, updateTaskForm } = useTaskStore();
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTaskForm({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskForm.description || !taskForm.location) {
      alert('Please complete all required fields');
      return;
    }
    
    onNext();
  };
  
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    function initAutocomplete() {
      if (inputRef.current && window.google) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ['address'] }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          const formattedAddress = place.formatted_address || inputRef.current.value;
          
          updateTaskForm({ location: formattedAddress });
          
          console.log("Selected Google location:", formattedAddress);
        });
      }
    }

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initAutocomplete();
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [updateTaskForm]);

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
            value={taskForm.description}
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
            ref={inputRef}
            type="text" 
            className="task-input"
            name="location"
            placeholder="Enter address or location"
            value={taskForm.location}
            onChange={handleChange}
            required
          />
        </div>
        
        {taskForm.location && (
          <div className="location-preview">
            <p>📍 Selected location: {taskForm.location}</p>
          </div>
        )}
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