import React from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa'
import '../css/TaskDetails.css'
import TaskImage from '../../assets/TaskImageDemo.png'  
import TaskDetail from '../../assets/taskDetails.jpg'  
import { Link } from 'react-router-dom'
import TaskMap from '../taskmap/TaskMap'

const TaskDetails = () => {
  const task = {
    id: 1,
    title: "Hang some pictures curtain brackets",
    status: "OPEN",
    postedBy: "Vanessa V.",
    location: "Newtown NSW, Australia",
    date: "Flexible",
    details: [
      "Need 5 sets of curtain brackets (6 total) + two ceramic artworks put up on double brick walls.",
      "Need person to supply own drill plus screws/hooks etc.",
      "The ceramic artworks already have holes drilled in them (see picture)"
    ],
    images: [
      TaskImage,
      TaskDetail
    ]
  };

  return (
    <div className="task-details-container">
      <div className="task-details-content">
        <div className="task-details-header">
          <Link to={'/allTask'} className="back-button">
            <FaArrowLeft size={12} /> Return to map
          </Link>
          
          <div className="task-status-tabs">
            <span className="status-tab active">OPEN</span>
            <span className="status-tab">ASSIGNED</span>
            <span className="status-tab">COMPLETED</span>
            <button className="follow-button">Follow</button>
          </div>
        </div>
        
        <h1 className="task-title">{task.title}</h1>
        
        <div className="task-details-main">
          <div className="task-details-info">
            <div className="info-section">
              <h3>POSTED BY</h3>
              <div className="poster-info">
                <div className="poster-avatar"></div>
                <span>{task.postedBy}</span>
              </div>
            </div>
            
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
            
            <div className="info-section details-section">
              <h3>Details</h3>
              {task.details.map((detail, index) => (
                <p key={index} className="detail-item">{detail}</p>
              ))}
            </div>
            
            <div className="task-images">
              {task.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`Task reference ${index + 1}`} 
                  className="task-image" 
                />
              ))}
            </div>
            
            <button className="show-more-button">Less</button>
            
            <div className="task-actions">
              <button className="primary-button">Make an offer</button>
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
  )
}

export default TaskDetails