import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import useNotificationStore from '../store/useNotification';

const NotificationCard = ({ notification }) => {
  const markAsRead = useNotificationStore(state => state.markAsRead);
  const isNew = !notification.read;
  
  const handleViewTask = (e) => {
    e.preventDefault();
    if (isNew) {
      markAsRead(notification.id);
    }
  };
  
  const handleDismiss = () => {
    if (isNew) {
      markAsRead(notification.id);
    }
  };
  
  const formattedDate = notification.createdAt ? 
    format(new Date(notification.createdAt), 'dd MMMM yyyy') : 
    format(new Date(), 'dd MMMM yyyy');
  
  const taskUploader = notification.task?.uploaduser || {};
  const uploaderName = 
    `${taskUploader.firstName || ''} ${taskUploader.lastName || ''}`.trim() || 
    'System';
  
  const imageUrl = taskUploader.profileImageUrl || "https://randomuser.me/api/portraits/men/32.jpg";
  
  return (
    <div className={`notification-card notification-card--modern ${isNew ? 'notification-card--new' : ''}`}>
      <div className="notification-card__status">
        {isNew && <span className="notification-status-indicator"></span>}
      </div>
      
      <div className="notification-card__header">
        <div className="notification-card__avatar">
          <img src={imageUrl} alt="User" />
        </div>
        <div className="notification-card__user-info">
          <span className="notification-card__user">{uploaderName}</span>
          <div className="notification-card__meta">
            <span className="notification-card__date">
              <AccessTimeIcon fontSize="small" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      <div className="notification-card__body">
        <strong>{notification.type === 'TASK_CREATED' ? 'New Task Posted!' : 'Task Accepted'}</strong> <br />
        {notification.message}
      </div>
      <div className="notification-card__footer">
        {notification.task?.budget && (
          <span className="notification-card__rating">
            <span className="rating-label">Budget:</span> 
            <span className="rating-value">${notification.task.budget}</span>
            <StarIcon style={{ color: '#ffd600', fontSize: 20, verticalAlign: 'middle' }} />
          </span>
        )}
        <div className="notification-card__actions">
          <button 
            className="notification-card__action notification-card__action--secondary"
            onClick={handleDismiss}
          >
            Dismiss
          </button>
          <a 
            href={`/tasks/${notification.task?.id}`} 
            className="notification-card__link"
            onClick={handleViewTask}
          >
            View Task
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;