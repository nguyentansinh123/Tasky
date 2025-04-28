import React, { useState } from 'react';
import '../css/DetailsStep.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useTaskStore } from '../../store/useTaskStore';

const DetailsStep = ({ onNext, onBack, onSubmitStart, onSubmitEnd }) => {
  const navigate = useNavigate();
  const { getToken } = useAuthStore();
  const { 
    taskForm, 
    updateTaskForm, 
    addImages, 
    removeImage, 
    submitTask, 
    isSubmitting 
  } = useTaskStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTaskForm({ [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmitStart) onSubmitStart();
    const success = await submitTask(getToken, navigate);
    if (onSubmitEnd) onSubmitEnd();
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
                value={taskForm.additionalInfo}
                onChange={handleChange}
                rows={5}
              />
              
              <div className="task-summary">
                <h4>Task Summary</h4>
                <p><strong>Title:</strong> {taskForm.taskTitle || "Not specified"}</p>
                <p><strong>Budget:</strong> {taskForm.budget?.currency || "$"} {taskForm.budget?.amount || "0"}</p>
                <p><strong>Location:</strong> {taskForm.location || "Not specified"}</p>
                <p><strong>Description:</strong> {taskForm.description || "Not specified"}</p>
              </div>
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
              
              {taskForm.images?.length > 0 && (
                <div className="image-preview-container">
                  <p>{taskForm.images.length} image(s) selected</p>
                  <div className="image-previews">
                    {taskForm.images.map((img, index) => (
                      <div key={index} className="image-preview-item">
                        <img 
                          src={URL.createObjectURL(img)} 
                          alt={`Preview ${index}`} 
                          className="image-preview"
                        />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              type="button" 
              className="nav-button back-button" 
              onClick={onBack}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="nav-button next-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Task...' : 'Submit Task'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DetailsStep;