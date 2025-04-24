import React, { useState, useEffect, useRef } from 'react';
import '../css/CreateTask.css';

const CreateTaskStep2 = ({ onNext, onBack }) => {
  const [details, setDetails] = useState({
    description: '',
    location: ''
  });
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          setDetails(prev => ({
            ...prev,
            location: place.formatted_address || inputRef.current.value
          }));
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
      // Clean up listener if component unmounts
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

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
            ref={inputRef}
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