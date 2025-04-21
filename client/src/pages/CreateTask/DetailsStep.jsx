import React, { useState } from 'react';
import '../css/DetailsStep.css';

const DetailsStep = ({ onNext, onBack }) => {
  const [details, setDetails] = useState({
    additionalInfo: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setDetails(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission would happen here");
    onNext(); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="details-wrapper">
        <div className="details-container">
          <div className="details-header">
            <h1>Provide more details</h1>
            <p className="subtitle">What are the details?</p>
          </div>
          <div className="details-content">
            <div className="detail-card">
              <div className="card-icon">📝</div>
              <h3>Write a summary of the key details</h3>
              <textarea 
                className="details-textarea" 
                name="additionalInfo"
                placeholder="Describe what needs to be done..."
                value={details.additionalInfo}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <div className="detail-card">
              <div className="card-icon">🖼️</div>
              <h3>Add images (optional)</h3>
              <div className="image-upload-area">
                <div className="upload-prompt">
                  <span className="upload-icon">+</span>
                  <p>Click to upload or drag and drop</p>
                  <p className="file-types">PNG, JPG, GIF (max. 10MB)</p>
                </div>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="file-input" 
                  multiple 
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
              {details.images.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <p>Selected files: {details.images.length}</p>
                </div>
              )}
            </div>
          </div>

          <div className="navigation-buttons">
            <button type="button" className="nav-button back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="nav-button next-button">
              Submit Task
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DetailsStep;