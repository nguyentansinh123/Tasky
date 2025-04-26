import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = () => (
  <aside className="sidebar sidebar--modern">
    <div className="sidebar__avatar">
      <AccountCircleIcon style={{ fontSize: 64, color: '#4f8cff' }} />
      <div className="sidebar__username">User name</div>
    </div>
    <nav className="sidebar__nav">
      <a href="#"><HomeIcon /> Home</a>
      <a href="#"><DashboardIcon /> Dashboard</a>
      <a href="#"><ListAltIcon /> My Services</a>
      <a href="#"><PaymentIcon /> Payments</a>
      <a href="#"><PaymentIcon /> Payment Methods</a>
      <a href="#"><NotificationsIcon /> Notifications</a>
      <a href="#" className="sidebar__settings">
        <SettingsIcon /> Settings
      </a>
    </nav>
  </aside>
);

export default Sidebar;