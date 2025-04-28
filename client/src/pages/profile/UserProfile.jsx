import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import EditProfileForm from '../../components/EditProfileForm';
import '../css/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { authUser, token } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [statistics, setStatistics] = useState({
    tasksCreated: 0,
    tasksCompleted: 0,
    averageRating: 0
  });
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  
  const isOwnProfile = authUser && ((userId && userId === authUser.id.toString()) || !userId);
  const profileId = userId || (authUser ? authUser.id : null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!profileId) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const authToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        const response = await axios.get(`http://localhost:9193/api/v1/users/${profileId}/user`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          console.log("Profile data:", response.data.data);
          const userData = response.data.data;
          setUser(userData);
          
          if (userData.profileImageId) {
            setProfileImageUrl(`http://localhost:9193/api/v1/images/image/download/${userData.profileImageId}`);
          }
        } else {
          setError(response.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again later.");
        
        if (isOwnProfile && authUser) {
          setUser(authUser);
          
          if (authUser.profileImageId) {
            setProfileImageUrl(`http://localhost:9193/api/v1/images/image/download/${authUser.profileImageId}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [profileId, token, isOwnProfile, authUser]);
  
  const handleEditProfileClose = () => {
    setShowEditProfile(false);
    
    if (isOwnProfile) {
      setLoading(true);
      setUser(authUser);
      
      if (authUser.profileImageId) {
        setProfileImageUrl(`http://localhost:9193/api/v1/images/image/download/${authUser.profileImageId}`);
      } else {
        setProfileImageUrl(null);
      }
      
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="profile-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="profile-back-link">Back to Home</Link>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="profile-error">
        <h2>User Not Found</h2>
        <p>The requested user profile could not be found.</p>
        <Link to="/" className="profile-back-link">Back to Home</Link>
      </div>
    );
  }
  
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  
  const getInitials = () => {
    const firstInitial = user.firstName ? user.firstName[0] : '';
    const lastInitial = user.lastName ? user.lastName[0] : '';
    return (firstInitial + lastInitial).toUpperCase();
  };
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="profile-avatar-wrapper">
              {profileImageUrl ? (
                <img 
                  src={profileImageUrl} 
                  alt={fullName} 
                  className="profile-avatar"
                  onError={() => setProfileImageUrl(null)} 
                />
              ) : (
                <div className="profile-avatar-fallback">
                  {getInitials()}
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{fullName}</h1>
            <div className="profile-email">{user.email}</div>
            
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-icon task-icon"></span>
                <span className="stat-value">{statistics.tasksCreated || 0}</span>
                <span className="stat-label">Tasks Created</span>
              </div>
              
              <div className="profile-stat">
                <span className="stat-icon completed-icon"></span>
                <span className="stat-value">{statistics.tasksCompleted || 0}</span>
                <span className="stat-label">Tasks Completed</span>
              </div>
              
              {statistics.averageRating > 0 && (
                <div className="profile-stat">
                  <span className="stat-icon rating-icon"></span>
                  <span className="stat-value">{statistics.averageRating.toFixed(1)}</span>
                  <span className="stat-label">Rating</span>
                </div>
              )}
            </div>
            
            {isOwnProfile && (
              <button 
                className="edit-profile-btn"
                onClick={() => setShowEditProfile(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-main">
            {user.description && (
              <div className="profile-section">
                <h2 className="section-title">About</h2>
                <div className="profile-bio">
                  <p>{user.description}</p>
                </div>
              </div>
            )}
            
            {user.workExperiences && user.workExperiences.length > 0 && (
              <div className="profile-section">
                <h2 className="section-title">
                  <span className="section-icon work-icon"></span>
                  Work Experience
                </h2>
                
                <div className="experience-list">
                  {user.workExperiences.map((experience, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <h3 className="experience-title">{experience.position}</h3>
                        <div className="experience-company">{experience.companyName}</div>
                        <div className="experience-period">
                          {experience.startYear} - {experience.endYear || 'Present'}
                        </div>
                      </div>
                      
                      {experience.description && (
                        <div className="experience-description">
                          <p>{experience.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {user.specialities && user.specialities.length > 0 && (
              <div className="profile-section">
                <h2 className="section-title">
                  <span className="section-icon specialty-icon"></span>
                  Specialities
                </h2>
                
                <div className="speciality-list">
                  {user.specialities.map((speciality, index) => (
                    <div key={index} className="speciality-item">
                      <h3 className="speciality-name">{speciality.name}</h3>
                      {speciality.description && (
                        <p className="speciality-description">{speciality.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon email-icon"></span>
                  <span className="contact-text">{user.email}</span>
                </div>
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3 className="sidebar-title">Member Since</h3>
              <div className="member-since">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showEditProfile && (
        <EditProfileForm onClose={handleEditProfileClose} />
      )}
    </div>
  );
};

export default UserProfile;