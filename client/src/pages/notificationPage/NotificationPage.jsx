import React, { useState, useEffect } from 'react';
import NotificationCard from '../../components/NotificationCard';
import Sidebar from '../../components/Sidebar';
import EditProfileForm from '../../components/EditProfileForm';
import '../css/NotificationPage.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import useNotificationStore from '../../store/useNotification';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import websocketService from '../config/WebSocketService';
import { useAuthStore } from '../../store/useAuthStore';

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { 
    notifications, 
    fetchNotifications, 
    isLoading, 
    markAllAsRead,
    addNotification
  } = useNotificationStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
      
      websocketService.connect().catch(err => {
        console.error("Failed to connect to WebSocket:", err);
      });
      
      const unsubscribe = websocketService.subscribe('notificationPage', (notification) => {
        addNotification(notification);
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [fetchNotifications, addNotification, authUser]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'tasks') return notification.type === 'TASK_CREATED' || notification.type === 'TASK_ACCEPTED';
    return true;
  });

  const groupedNotifications = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };

  filteredNotifications.forEach(notification => {
    if (!notification.createdAt) {
      groupedNotifications.today.push(notification);
      return;
    }
    
    const date = new Date(notification.createdAt);
    if (isToday(date)) {
      groupedNotifications.today.push(notification);
    } else if (isYesterday(date)) {
      groupedNotifications.yesterday.push(notification);
    } else if (isThisWeek(date)) {
      groupedNotifications.thisWeek.push(notification);
    } else {
      groupedNotifications.older.push(notification);
    }
  });

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="notification-layout notification-layout--modern">
      <Sidebar />
      <main className="notification-main">
        <div className="notification-header">
          <div className="notification-header__content">
            <NotificationsActiveIcon className="notification-header__icon" />
            <h2 className="notification-title">Notifications</h2>
          </div>
          
          <div className="notification-header__actions">
            <button 
              className="edit-profile-btn"
              onClick={() => setShowEditProfile(true)}
            >
               Edit Profile
            </button>
            
            <div className="notification-filters">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveFilter('unread')}
              >
                Unread
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveFilter('tasks')}
              >
                Tasks
              </button>
              <button className="filter-more">
                <FilterListIcon fontSize="small" />
                <span>More</span>
                <ArrowDropDownIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="notification-action-bar">
          <button className="mark-all-read" onClick={handleMarkAllAsRead}>
            <MarkEmailReadIcon fontSize="small" />
            Mark all as read
          </button>
        </div>
        
        {isLoading ? (
          <div className="notification-loading">Loading notifications...</div>
        ) : (
          <div className="notification-list">
            {groupedNotifications.today.length > 0 && (
              <div className="notification-date-group">
                <div className="notification-date">Today</div>
                {groupedNotifications.today.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            )}
            
            {groupedNotifications.yesterday.length > 0 && (
              <div className="notification-date-group">
                <div className="notification-date">Yesterday</div>
                {groupedNotifications.yesterday.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            )}
            
            {groupedNotifications.thisWeek.length > 0 && (
              <div className="notification-date-group">
                <div className="notification-date">Earlier this week</div>
                {groupedNotifications.thisWeek.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            )}
            
            {groupedNotifications.older.length > 0 && (
              <div className="notification-date-group">
                <div className="notification-date">Older</div>
                {groupedNotifications.older.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            )}
            
            {Object.values(groupedNotifications).every(group => group.length === 0) && (
              <div className="empty-state">
                <p>No notifications to display.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {showEditProfile && (
        <EditProfileForm onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
};

export default NotificationPage;