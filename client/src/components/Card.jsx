import React, { useState, useEffect } from 'react';
import '../pages/css/Card.css';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ImgDemo from '../assets/TaskImageDemo.png';
import { useAuthStore } from '../store/useAuthStore';

const formatDate = (dateString) => {
  if (!dateString) return 'Flexible';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const Card = ({ task }) => {
  const { getToken } = useAuthStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!task) {
    task = {
      id: 1,
      taskName: 'Hang some pictures',
      description: 'Need help hanging several pictures in my living room. Must have own tools and experience with drywall.',
      location: 'NewTown NSW',
      budget: 75.00,
      status: 'PENDING',
      taskDate: '2025-04-27T14:00:00',
      dueDate: '2025-04-30T17:00:00',
      category: { name: 'Household' },
      images: []
    };
  }

  const { taskName, description, location, budget, status, taskDate, dueDate, category, images } = task;
  
  const getImageUrl = () => {
    try {
      if (!images || images.length === 0) {
        console.log(`Task ${task.id}: No images found`);
        return null;
      }
      
      const firstImage = images[0];
      
      console.log(`Task ${task.id} first image:`, firstImage);
      
      if (firstImage && firstImage.downloadUrl) {
        const imageId = firstImage.id || 
                      firstImage.downloadUrl.split('/').pop() || 
                      1;
                      
        console.log(`Using image ID: ${imageId}`);
        
        return imageId;
      }
      
      return null;
    } catch (error) {
      console.error('Error in getImageUrl:', error);
      return null;
    }
  };
  
  const imageId = getImageUrl();
  const displayStatus = status === 'PENDING' ? 'Open' : status;
  
  const displayDate = taskDate || dueDate;
  
  const cleanDescription = description ? 
    description.replace(/<\/?[^>]+(>|$)/g, "") : 
    'No description available';
  
  const truncatedDescription = cleanDescription.length > 100 ? 
    `${cleanDescription.substring(0, 97)}...` : 
    cleanDescription;
    
  const fetchImageWithAuth = (imgElement) => {
    if (!imageId) return;
    
    const token = getToken();
    if (!token) return;
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:9193/api/v1/images/image/download/${imageId}`, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    
    xhr.onload = function() {
      if (this.status === 200) {
        const blob = new Blob([this.response], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        
        if (imgElement && imgElement.current) {
          imgElement.current.src = url;
          setImageLoaded(true);
        }
      } else {
        console.error('Failed to load image:', this.status);
      }
    };
    
    xhr.onerror = function() {
      console.error('Error during image fetch');
    };
    
    xhr.send();
  };
  
  const imgRef = React.useRef(null);
  
  useEffect(() => {
    if (imageId && imgRef.current) {
      fetchImageWithAuth(imgRef);
    }
  }, [imageId]);

  return (
    <div className="task-card">
      <div className="task-card__image">
        <img 
          ref={imgRef}
          src={ImgDemo} 
          alt={taskName} 
          onError={(e) => {
            console.warn('Image failed to load');
            e.target.src = ImgDemo;
            e.target.onerror = null;
          }}
        />
        <div className="task-card__badge">${budget?.toFixed(2) || '0.00'}</div>
      </div>
      <div className="task-card__content">
        <div className="task-card__header">
          <span className="task-card__category">{category?.name || 'Uncategorized'}</span>
          <span className={`task-card__status task-card__status--${status?.toLowerCase() || 'pending'}`}>
            {displayStatus}
          </span>
        </div>
        <h2 className="task-card__title">{taskName || 'Untitled Task'}</h2>
        <p className="task-card__desc">{truncatedDescription}</p>
        <div className="task-card__meta">
          <div className="task-card__meta-item">
            <LocationOnIcon className="task-card__icon" />
            <span>{location || 'Location not specified'}</span>
          </div>
          <div className="task-card__meta-item">
            <CalendarTodayIcon className="task-card__icon" />
            <span>{formatDate(displayDate)}</span>
          </div>
        </div>
        <div className="task-card__footer">
          <button className="task-card__button">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default Card;