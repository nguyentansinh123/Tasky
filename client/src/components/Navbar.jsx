import React, { useEffect, useState } from 'react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import "../pages/css/Navbar.css"; 
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import useNotificationStore from '../store/useNotification';
import websocketService from '../pages/config/WebSocketService';

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/premium-vector/cute-avatar-akita-head-simple-cartoon-vector-illustration-dog-breeds-nature-concept-icon-isolated_772770-320.jpg";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { profileImageUrl, getProfileImageUrl, isLoadingProfileImage } = useUserStore();
  const { unreadCount, fetchNotifications, addNotification } = useNotificationStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const userName = authUser ? 
    `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'User' : 
    'Guest';

  useEffect(() => {
    const loadProfileImage = async () => {
      await getProfileImageUrl();
      setImageLoaded(true);
    };
    
    if (authUser) {
      loadProfileImage();
      fetchNotifications();
      
      websocketService.connect().then(() => {
        console.log("WebSocket connected in Navbar");
      }).catch(err => {
        console.error("WebSocket connection failed in Navbar:", err);
      });
      
      const unsubscribe = websocketService.subscribe('navbar', (notification) => {
        addNotification(notification);
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [authUser, getProfileImageUrl, fetchNotifications, addNotification]);

  return (
    <nav className='navbar-container'>
        <div className='navbar-logo-container'>
            <h1 className='navbar-logo-text'>The Site</h1>
        </div>
        <div className='navbar-links-container'>
            <a href="/" className='nav-link'>Home</a>
            <Link to={"/allTask"} className='nav-link'>Browse Task</Link>
            <Link to={"/myTask"} className='nav-link'>My Task</Link>
            <a href="/contact" className='nav-link'>Contact</a>
        </div>
        <div className="navbar-actions-container">
            <div className="navbar-icons">
                <Link to={'/chat'}>
                    <ChatBubbleIcon className='navbar-icon'/>
                </Link>
                <Link to={'/notification'} className="notification-wrapper">
                    <NotificationsIcon className='navbar-icon'/>
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </Link>
            </div>
            <div className="navbar-profile">
                {isLoadingProfileImage && !imageLoaded ? (
                    <div className="navbar-profile-loading">
                        <div className="spinner-small"></div>
                    </div>
                ) : (
                    <img 
                        src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
                        className='navbar-profile-pic' 
                        alt="User profile" 
                        onError={(e) => {
                            console.error("Error loading navbar profile image:", e.target.src);
                            e.target.src = DEFAULT_PROFILE_IMAGE;
                        }}
                    />
                )}
                <Link to={'/notification'}>
                    <p className='navbar-username'>{userName}</p>
                </Link>
            </div>
            <Link to={"/createTask"} className='navbar-button'>Create Task</Link>
            <Link to="/profile" className="nav-item">
                <PersonIcon style={{color:"white"}} />
                <span style={{color:"white"}}>My Profile</span>
            </Link>
        </div>
    </nav>
  );
};

export default Navbar;