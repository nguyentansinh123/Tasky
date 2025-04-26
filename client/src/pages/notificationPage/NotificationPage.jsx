import React, { useState } from 'react';
import NotificationCard from '../../components/NotificationCard';
import Sidebar from '../../components/Sidebar';
import '../css/NotificationPage.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="notification-layout notification-layout--modern">
      <Sidebar />
      <main className="notification-main">
        <div className="notification-header">
          <div className="notification-header__content">
            <NotificationsActiveIcon className="notification-header__icon" />
            <h2 className="notification-title">Notifications</h2>
          </div>
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
        
        <div className="notification-action-bar">
          <button className="mark-all-read">
            <MarkEmailReadIcon fontSize="small" />
            Mark all as read
          </button>
        </div>
        
        <div className="notification-list">
          <div className="notification-date-group">
            <div className="notification-date">Today</div>
            <NotificationCard isNew={true} />
            <NotificationCard isNew={true} />
          </div>
          
          <div className="notification-date-group">
            <div className="notification-date">Yesterday</div>
            <NotificationCard isNew={true} />
            <NotificationCard />
          </div>
          
          <div className="notification-date-group">
            <div className="notification-date">Earlier this week</div>
            <NotificationCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;