import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const NotificationCard = ({ isNew }) => (
  <div className={`notification-card notification-card--modern ${isNew ? 'notification-card--new' : ''}`}>
    <div className="notification-card__status">
      {isNew && <span className="notification-status-indicator"></span>}
    </div>
    
    <div className="notification-card__header">
      <div className="notification-card__avatar">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
      </div>
      <div className="notification-card__user-info">
        <span className="notification-card__user">Alex Johnson</span>
        <div className="notification-card__meta">
          <span className="notification-card__date">
            <AccessTimeIcon fontSize="small" />
            22 March 2025
          </span>
        </div>
      </div>
    </div>
    <div className="notification-card__body">
      <strong>New Task Posted!</strong> <br />
      There is a new task that has just been posted on the platform, and it's now live for you to view, bid on, or accept if it matches your skills and availability. The task includes a detailed description outlining the requirements.
    </div>
    <div className="notification-card__footer">
      <span className="notification-card__rating">
        <span className="rating-label">Rating:</span> 
        <span className="rating-value">4.5</span>
        <StarIcon style={{ color: '#ffd600', fontSize: 20, verticalAlign: 'middle' }} />
      </span>
      <div className="notification-card__actions">
        <button className="notification-card__action notification-card__action--secondary">Dismiss</button>
        <a href="#" className="notification-card__link">View Task</a>
      </div>
    </div>
  </div>
);

export default NotificationCard;