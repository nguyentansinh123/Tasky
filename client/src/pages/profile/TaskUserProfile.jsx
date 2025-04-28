import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { FaStar, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaArrowLeft } from 'react-icons/fa';
import './TaskUserProfile.css';
import toast from 'react-hot-toast';
import ReviewsSection from '../../components/reviews/ReviewsSection';

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/premium-vector/cute-avatar-akita-head-simple-cartoon-vector-illustration-dog-breeds-nature-concept-icon-isolated_772770-320.jpg";

const TaskUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [userTasks, setUserTasks] = useState({ completed: [], active: [] });
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication required');
          toast.error('Please log in to view user profiles');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:9193/api/v1/users/${userId}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.success) {
          console.log('User Profile Data:', response.data.data);
          const userData = response.data.data;
          setProfile(userData);
          
          if (userData.profileImageUrl) {
            const imageIdMatch = userData.profileImageUrl.match(/\/download\/(\d+)$/);
            const imageId = imageIdMatch ? imageIdMatch[1] : null;
            
            console.log('Extracted Image ID:', imageId);
            
            if (imageId) {
              try {
                const imageResponse = await axios.get(
                  `http://localhost:9193/api/v1/images/image/download/${imageId}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    responseType: 'blob'
                  }
                );
                
                console.log('Image Response Status:', imageResponse.status);
                
                if (imageResponse.data) {
                  const blob = imageResponse.data;
                  console.log('Image Blob Size:', blob.size);
                  console.log('Image Blob Type:', blob.type);
                  
                  const imageUrl = URL.createObjectURL(blob);
                  console.log('Created Image URL:', imageUrl);
                  setProfileImage(imageUrl);
                }
              } catch (imgErr) {
                console.error('Error loading profile image:', imgErr);
              }
            }
          } else {
            console.log('No profile image URL found for user');
          }
          
          try {
            const tasksResponse = await axios.get(
              `http://localhost:9193/api/v1/tasks/user/${userId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (tasksResponse.data && tasksResponse.data.success) {
              const tasks = tasksResponse.data.data || [];
              const completed = tasks.filter(task => task.status === 'COMPLETED');
              const active = tasks.filter(task => task.status !== 'COMPLETED');
              setUserTasks({ completed, active });
            }
          } catch (taskErr) {
            console.error('Error fetching user tasks:', taskErr);
          }

          try {
            const authUserResponse = await axios.get(
              `http://localhost:9193/api/v1/users/authenticated`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            if (authUserResponse.data && authUserResponse.data.success) {
              setAuthUser(authUserResponse.data.data);
            }
          } catch (authErr) {
            console.error('Error fetching authenticated user data:', authErr);
          }
        } else {
          console.error('API returned error or no success flag:', response.data);
          setError('Failed to load user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
        }
        setError('Error loading user profile');
        toast.error('Could not load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    
    return () => {
      if (profileImage !== DEFAULT_PROFILE_IMAGE) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [userId, getToken, navigate]);
  
  const getCompletionRate = () => {
    if (!userTasks.completed.length && !userTasks.active.length) return 0;
    const total = userTasks.completed.length + userTasks.active.length;
    return Math.round((userTasks.completed.length / total) * 100);
  };

  if (loading) {
    return (
      <div className="task-user-profile-container loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-user-profile-container error">
        <div className="error-message">
          <FaUser size={48} />
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <Link to="/allTask" className="back-link">Back to Tasks</Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="task-user-profile-container error">
        <div className="error-message">
          <FaUser size={48} />
          <h2>User Not Found</h2>
          <p>We couldn't find the user profile you're looking for.</p>
          <Link to="/allTask" className="back-link">Back to Tasks</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="task-user-profile-container">
      <div className="task-user-profile-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft size={12} /> Back
        </button>
        
        <div className="task-user-profile-badges">
          {profile.verified && (
            <span className="badge verified-badge">
              <FaCheck /> Verified
            </span>
          )}
        </div>
      </div>
      
      <div className="task-user-profile-content">
        <div className="task-user-profile-main">
          <div className="task-user-profile-avatar">
            <img 
              src={profileImage} 
              alt={`${profile.firstName} ${profile.lastName}`}
              onError={(e) => {
                e.target.src = DEFAULT_PROFILE_IMAGE;
                e.target.onerror = null;
              }}
            />
          </div>
          
          <div className="task-user-profile-info">
            <h1 className="task-user-profile-name">
              {profile.firstName} {profile.lastName}
            </h1>
            
            {profile.location && (
              <div className="task-user-location">
                <FaMapMarkerAlt className="location-icon" />
                <span>{profile.location}</span>
              </div>
            )}
            
            <div className="task-user-stats">
              {profile.rating !== undefined && (
                <div className="stat-item">
                  <div className="stat-value">
                    <FaStar className="star-icon" />
                    <span>{profile.rating?.toFixed(1) || "New"}</span>
                  </div>
                  <div className="stat-label">Rating</div>
                </div>
              )}
              
              <div className="stat-item">
                <div className="stat-value">{userTasks.completed.length || 0}</div>
                <div className="stat-label">Tasks Completed</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{getCompletionRate()}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </div>
                <div className="stat-label">Member Since</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="task-user-profile-details">
          <div className="profile-section">
            <h3>About</h3>
            <p className="profile-bio">
              {profile.description || "This user hasn't added a bio yet."}
            </p>
          </div>
          
          <div className="profile-section">
            <h3>Specialties</h3>
            <div className="specialty-tags">
              {profile.specialities && profile.specialities.length > 0 ? (
                profile.specialities.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty.name}</span>
                ))
              ) : (
                <span className="no-specialties">No specialties listed</span>
              )}
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Work Experience</h3>
            {profile.workExperiences && profile.workExperiences.length > 0 ? (
              <div className="work-experience-list">
                {profile.workExperiences.map((work, index) => (
                  <div key={index} className="work-item">
                    <div className="work-position">{work.position}</div>
                    <div className="work-company">{work.companyName}</div>
                    <div className="work-period">{work.startYear} - {work.endYear || 'Present'}</div>
                    {work.description && <div className="work-description">{work.description}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-experience">No work experience listed</p>
            )}
          </div>
          
          <div className="profile-section">
            <h3>Completed Tasks ({userTasks.completed.length})</h3>
            {userTasks.completed.length > 0 ? (
              <div className="completed-tasks-list">
                {userTasks.completed.slice(0, 5).map(task => (
                  <div key={task.id} className="task-item" onClick={() => navigate(`/tasks/${task.id}`)}>
                    <div className="task-item-title">{task.title}</div>
                    <div className="task-item-date">
                      {new Date(task.completedAt || task.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {userTasks.completed.length > 5 && (
                  <div className="view-more-tasks">
                    + {userTasks.completed.length - 5} more tasks
                  </div>
                )}
              </div>
            ) : (
              <p className="no-tasks">No completed tasks yet</p>
            )}
          </div>

          {profile && (
            <ReviewsSection 
              reviews={profile.receivedReviews || []} 
              title="Reviews"
              userId={profile.id}
              canReview={profile.id !== authUser?.id} 
            />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default TaskUserProfile;