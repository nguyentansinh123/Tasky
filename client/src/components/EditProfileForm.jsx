import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../pages/css/EditProfileForm.css';

const EditProfileForm = ({ onClose }) => {
  const { authUser, token, updateAuthUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: authUser?.firstName || '',
    lastName: authUser?.lastName || '',
    description: authUser?.description || '',
    workExperiences: authUser?.workExperiences || [],
    specialities: authUser?.specialities || []
  });
  
  const [loading, setLoading] = useState(false);
  
  const createEmptyWorkExperience = () => ({
    companyName: '',
    position: '',
    description: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear()
  });
  
  const createEmptySpeciality = () => ({
    name: '',
    description: ''
  });
  
  useEffect(() => {
    if (formData.workExperiences.length === 0) {
      setFormData(prev => ({
        ...prev,
        workExperiences: [createEmptyWorkExperience()]
      }));
    }
    
    if (formData.specialities.length === 0) {
      setFormData(prev => ({
        ...prev,
        specialities: [createEmptySpeciality()]
      }));
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleWorkExperienceChange = (index, field, value) => {
    const updatedWorkExperiences = [...formData.workExperiences];
    updatedWorkExperiences[index][field] = value;
    setFormData({ ...formData, workExperiences: updatedWorkExperiences });
  };
  
  const handleSpecialityChange = (index, field, value) => {
    const updatedSpecialities = [...formData.specialities];
    updatedSpecialities[index][field] = value;
    setFormData({ ...formData, specialities: updatedSpecialities });
  };
  
  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperiences: [...formData.workExperiences, createEmptyWorkExperience()]
    });
  };
  
  const removeWorkExperience = (index) => {
    const updatedWorkExperiences = [...formData.workExperiences];
    updatedWorkExperiences.splice(index, 1);
    setFormData({ ...formData, workExperiences: updatedWorkExperiences });
  };
  
  const addSpeciality = () => {
    setFormData({
      ...formData,
      specialities: [...formData.specialities, createEmptySpeciality()]
    });
  };
  
  const removeSpeciality = (index) => {
    const updatedSpecialities = [...formData.specialities];
    updatedSpecialities.splice(index, 1);
    setFormData({ ...formData, specialities: updatedSpecialities });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.firstName || !formData.lastName) {
        toast.error('First name and last name are required');
        setLoading(false);
        return;
      }
      
      const validWorkExperiences = formData.workExperiences.filter(
        exp => exp.companyName && exp.position
      );
      
      const validSpecialities = formData.specialities.filter(
        spec => spec.name
      );
      
      const payload = {
        ...formData,
        workExperiences: validWorkExperiences,
        specialities: validSpecialities
      };
      
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.put(
        `http://localhost:9193/api/v1/users/${authUser.id}/update`,
        payload,
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        
        updateAuthUser({
          ...authUser,
          ...response.data.data
        });
        
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response && error.response.status === 405) {
        try {
          const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          
          const payload = {
            ...formData,
            workExperiences: formData.workExperiences.filter(exp => exp.companyName && exp.position),
            specialities: formData.specialities.filter(spec => spec.name)
          };
          
          const response = await axios.patch(
            `http://localhost:9193/api/v1/users/${authUser.id}/update`,
            payload,
            {
              headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data.success) {
            toast.success('Profile updated successfully');
            updateAuthUser({...authUser, ...response.data.data});
            onClose();
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback method failed:', fallbackError);
        }
      }
      
      toast.error(error.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="edit-overlay">
      <div className="edit-modal">
        <div className="edit-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="edit-content">
          <form onSubmit={handleSubmit}>
            <div className="edit-section">
              <h3 className="edit-section-title">Basic Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Bio/Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="edit-section">
              <div className="section-header">
                <h3 className="edit-section-title">Work Experience</h3>
                <button
                  type="button"
                  className="add-button"
                  onClick={addWorkExperience}
                >
                  Add Experience
                </button>
              </div>
              
              {formData.workExperiences.map((exp, index) => (
                <div key={index} className="work-experience-item">
                  <div className="experience-header">
                    <h4>Experience {index + 1}</h4>
                    {formData.workExperiences.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeWorkExperience(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        placeholder="Position"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities"
                      rows={2}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Year</label>
                      <input
                        type="number"
                        value={exp.startYear}
                        onChange={(e) => handleWorkExperienceChange(index, 'startYear', parseInt(e.target.value))}
                        min="1950"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Year</label>
                      <input
                        type="number"
                        value={exp.endYear}
                        onChange={(e) => handleWorkExperienceChange(index, 'endYear', parseInt(e.target.value))}
                        min={exp.startYear}
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="edit-section">
              <div className="section-header">
                <h3 className="edit-section-title">Specialities</h3>
                <button
                  type="button"
                  className="add-button"
                  onClick={addSpeciality}
                >
                  Add Speciality
                </button>
              </div>
              
              {formData.specialities.map((spec, index) => (
                <div key={index} className="speciality-form-item">
                  <div className="experience-header">
                    <h4>Speciality {index + 1}</h4>
                    {formData.specialities.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeSpeciality(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) => handleSpecialityChange(index, 'name', e.target.value)}
                      placeholder="Speciality Name (e.g. JavaScript, UX Design)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={spec.description}
                      onChange={(e) => handleSpecialityChange(index, 'description', e.target.value)}
                      placeholder="Describe your expertise in this area"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;