import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import '../css/TaskDetails.css';
import ImgDemo from '../../assets/TaskImageDemo.png';
import { Link } from 'react-router-dom';
import TaskMap from '../taskmap/TaskMap';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/premium-vector/cute-avatar-akita-head-simple-cartoon-vector-illustration-dog-breeds-nature-concept-icon-isolated_772770-320.jpg";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, authUser } = useAuthStore();
  
  const [task, setTask] = useState({
    id: 1,
    title: "update",
    status: "OPEN",
    postedBy: "sinh N.",
    location: "123213132 Main Street,xzczxc Sydney",
    date: "April 25, 2024",
    budget: 1150.00,
    details: [
      "Need a plumber to sadasdsazxcfix leaking kitchen sink2"
    ],
    category: "outdoor"
  });
  
  const [loading, setLoading] = useState(true);
  const [acceptingTask, setAcceptingTask] = useState(false);
  const [error, setError] = useState(null);
  const [taskImages, setTaskImages] = useState([ImgDemo]);
  const [posterImage, setPosterImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [acceptorImage, setAcceptorImage] = useState(DEFAULT_PROFILE_IMAGE);

  const formatTaskData = (apiData) => {
    const detailsArray = apiData.description 
      ? apiData.description.split('\n').filter(line => line.trim().length > 0)
      : ["No details provided"];
    
    return {
      id: apiData.id,
      title: apiData.taskName,
      status: apiData.status === "PENDING" ? "OPEN" : apiData.status,
      postedBy: apiData.uploaduser ? 
        `${apiData.uploaduser.firstName} ${apiData.uploaduser.lastName.charAt(0)}.` : 
        "Anonymous",
      acceptedBy: apiData.acceptedUser ?
        `${apiData.acceptedUser.firstName} ${apiData.acceptedUser.lastName.charAt(0)}.` :
        null,
      location: apiData.location,
      date: formatDate(apiData.dueDate),
      budget: apiData.budget,
      details: detailsArray,
      category: apiData.category?.name || "General",
      uploaduser: apiData.uploaduser,
      acceptedUser: apiData.acceptedUser,
      apiImages: apiData.images || []
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Flexible';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const loadImages = async (apiImages) => {
    if (!apiImages || apiImages.length === 0) {
      return [ImgDemo]; 
    }
    
    try {
      const token = getToken();
      if (!token) return [ImgDemo];
      
      const loadedImages = [];
      
      for (const image of apiImages) {
        try {
          const response = await fetch(`http://localhost:9193${image.downloadUrl}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to load image: ${response.status}`);
          }
          
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          loadedImages.push(imageUrl);
        } catch (err) {
          console.error('Error loading an image:', err);
          loadedImages.push(ImgDemo);
        }
      }
      
      return loadedImages.length > 0 ? loadedImages : [ImgDemo];
    } catch (err) {
      console.error('Error in image loading process:', err);
      return [ImgDemo];
    }
  };
  
  const loadProfileImage = async (profileImage) => {
    if (!profileImage || !profileImage.downloadUrl) {
      return DEFAULT_PROFILE_IMAGE;
    }
    
    try {
      const token = getToken();
      if (!token) return DEFAULT_PROFILE_IMAGE;
      
      const response = await fetch(`http://localhost:9193${profileImage.downloadUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load profile image: ${response.status}`);
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error loading profile image:', err);
      return DEFAULT_PROFILE_IMAGE;
    }
  };

  const handleAcceptTask = async () => {
    if (acceptingTask) return;
    
    setAcceptingTask(true);
    
    try {
      const token = getToken();
      if (!token) {
        toast.error('Please log in to accept this task');
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `http://localhost:9193/api/v1/tasks/${id}/accept`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.success) {
        toast.success('Task accepted successfully!');
        
        setTask(prev => ({
          ...prev,
          status: 'ASSIGNED',
          acceptedBy: `${authUser.firstName} ${authUser.lastName.charAt(0)}.`,
          acceptedUser: authUser
        }));
        
        if (authUser.profileImageId) {
          const acceptorImg = await loadProfileImage({ 
            downloadUrl: `/api/v1/images/image/download/${authUser.profileImageId}` 
          });
          setAcceptorImage(acceptorImg);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to accept the task');
      }
    } catch (error) {
      console.error('Error accepting task:', error);
      
      if (error.response && error.response.status === 403) {
        toast.error('You do not have permission to accept this task. Only users with worker role can accept tasks.');
      } else if (error.response && error.response.status === 400) {
        toast.error(error.response.data?.message || 'This task cannot be accepted. It may already be assigned.');
      } else {
        toast.error('Failed to accept task. Please try again later.');
      }
    } finally {
      setAcceptingTask(false);
    }
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) {
        setLoading(false);
        return; 
      }
      
      setLoading(true);
      
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication required');
          toast.error('Please log in to view task details');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:9193/api/v1/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.success && response.data.data) {
          const formattedTask = formatTaskData(response.data.data);
          setTask(formattedTask);
          
          const images = await loadImages(response.data.data.images);
          setTaskImages(images);
          
          if (formattedTask.uploaduser?.profileImage) {
            const uploaderImage = await loadProfileImage(formattedTask.uploaduser.profileImage);
            setPosterImage(uploaderImage);
          }
          
          if (formattedTask.acceptedUser?.profileImage) {
            const acceptorImg = await loadProfileImage(formattedTask.acceptedUser.profileImage);
            setAcceptorImage(acceptorImg);
          }
        } else {
          throw new Error('Failed to load task details');
        }
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError(err.response?.data?.message || 'Error loading task');
        toast.error('Could not load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
    
    return () => {
      taskImages.forEach(img => {
        if (img !== ImgDemo && typeof img === 'string' && img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
      
      if (posterImage && posterImage !== DEFAULT_PROFILE_IMAGE && posterImage.startsWith('blob:')) {
        URL.revokeObjectURL(posterImage);
      }
      
      if (acceptorImage && acceptorImage !== DEFAULT_PROFILE_IMAGE && acceptorImage.startsWith('blob:')) {
        URL.revokeObjectURL(acceptorImage);
      }
    };
  }, [id, getToken, navigate]);

  if (loading) {
    return (
      <div className="task-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-details-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            className="primary-button" 
            onClick={() => navigate('/allTask')}
          >
            Back to All Tasks
          </button>
        </div>
      </div>
    );
  }

  const isTaskCreator = authUser && task.uploaduser && authUser.id === task.uploaduser.id;

  return (
    <div className="task-details-container">
      <div className="task-details-content">
        <div className="task-details-header">
          <Link to={'/allTask'} className="back-button">
            <FaArrowLeft size={12} /> Return to map
          </Link>
          
          <div className="task-status-tabs">
            <span className={`status-tab ${task.status === 'OPEN' ? 'active' : ''}`}>OPEN</span>
            <span className={`status-tab ${task.status === 'ASSIGNED' ? 'active' : ''}`}>ASSIGNED</span>
            <span className={`status-tab ${task.status === 'COMPLETED' ? 'active' : ''}`}>COMPLETED</span>
            <button className="follow-button">Follow</button>
          </div>
        </div>
        
        <h1 className="task-title">{task.title}</h1>
        
        <div className="task-details-main">
          <div className="task-details-info">
            <div className="info-section">
              <h3>POSTED BY</h3>
              <div className="poster-info">
                <div 
                  className="poster-avatar clickable" 
                  onClick={() => task.uploaduser?.id && navigate(`/task-user/${task.uploaduser.id}`)}
                  title="View profile"
                >
                  <img 
                    src={posterImage}
                    alt="Poster avatar"
                    onError={(e) => {
                      e.target.src = DEFAULT_PROFILE_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <span className="user-name clickable" onClick={() => task.uploaduser?.id && navigate(`/task-user/${task.uploaduser.id}`)}>
                  {task.postedBy}
                </span>
              </div>
            </div>
            
            {task.acceptedBy && (
              <div className="info-section">
                <h3>ACCEPTED BY</h3>
                <div className="poster-info">
                  <div 
                    className="poster-avatar clickable" 
                    onClick={() => task.acceptedUser?.id && navigate(`/task-user/${task.acceptedUser.id}`)}
                    title="View profile"
                  >
                    <img 
                      src={acceptorImage}
                      alt="Worker avatar"
                      onError={(e) => {
                        e.target.src = DEFAULT_PROFILE_IMAGE;
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <span className="user-name clickable" onClick={() => task.acceptedUser?.id && navigate(`/task-user/${task.acceptedUser.id}`)}>
                    {task.acceptedBy}
                  </span>
                </div>
              </div>
            )}
            
            <div className="info-section">
              <h3>LOCATION</h3>
              <div className="location-info">
                <FaMapMarkerAlt className="info-icon" size={14} />
                <span>{task.location}</span>
              </div>
            </div>
            
            <div className="info-section">
              <h3>TO BE DONE ON</h3>
              <div className="date-info">
                <FaCalendarAlt className="info-icon" size={14} />
                <span>{task.date}</span>
              </div>
            </div>
            
            {task.budget && (
              <div className="info-section">
                <h3>BUDGET</h3>
                <div className="budget-info">
                  <span>${task.budget.toFixed(2)}</span>
                </div>
              </div>
            )}
            
            {task.category && (
              <div className="info-section">
                <h3>CATEGORY</h3>
                <div className="category-info">
                  <span>{task.category}</span>
                </div>
              </div>
            )}
            
            <div className="info-section details-section">
              <h3>DETAILS</h3>
              {task.details.map((detail, index) => (
                <p key={index} className="detail-item">{detail}</p>
              ))}
            </div>
            
            <div className="task-images">
              {taskImages.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`Task reference ${index + 1}`} 
                  className="task-image"
                  onError={(e) => {
                    e.target.src = ImgDemo;
                    e.target.onerror = null;
                  }} 
                />
              ))}
            </div>
            
            <div className="task-actions">
              {task.status === 'OPEN' && !isTaskCreator && (
                <button 
                  className={`primary-button ${acceptingTask ? 'loading' : ''}`}
                  onClick={handleAcceptTask}
                  disabled={acceptingTask}
                >
                  {acceptingTask 
                    ? 'Accepting...' 
                    : (task.budget ? `Accept Task ($${task.budget.toFixed(2)})` : 'Accept Task')
                  }
                </button>
              )}
              
              {isTaskCreator && task.status === 'OPEN' && (
                <div className="info-message">
                  You cannot accept your own task
                </div>
              )}
            </div>
          </div>
          
          <div className="task-map-placeholder">
            <TaskMap taskLocations={[
              {
                location: task.location,
                title: task.title,
                label: "A"
              }
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;