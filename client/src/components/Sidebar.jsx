import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import { useAuthStore } from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/premium-vector/cute-avatar-akita-head-simple-cartoon-vector-illustration-dog-breeds-nature-concept-icon-isolated_772770-320.jpg";

const Sidebar = () => {
  const { authUser } = useAuthStore();
  const { 
    updateProfileImage, 
    isUpdatingProfileImage, 
    getProfileImageUrl, 
    profileImageUrl,
    isLoadingProfileImage
  } = useUserStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef(null);
  
  const userName = authUser ? 
    `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'User' : 
    'Guest';
  
  useEffect(() => {
    const loadProfileImage = async () => {
      await getProfileImageUrl();
      setImageLoaded(true);
    };
    
    loadProfileImage();
  }, [authUser, getProfileImageUrl]);
  
  const handleAvatarClick = () => {
    if (isUpdatingProfileImage) return;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await updateProfileImage(file);
    
    e.target.value = '';
  };

  return (
    <aside className="sidebar sidebar--modern">
      <div className="profile-section">
        <div className="profile-avatar-wrapper" onClick={handleAvatarClick}>
          {isLoadingProfileImage && !imageLoaded ? (
            <div className="profile-avatar-placeholder">
              <div className="spinner"></div>
            </div>
          ) : (
            <img 
              src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
              alt="Profile" 
              className="profile-avatar"
              onError={(e) => {
                console.error("Error loading image from URL:", e.target.src);
                e.target.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
          )}
          
          <div className="profile-avatar-overlay">
            <CameraAltIcon />
          </div>
          
          {isUpdatingProfileImage && (
            <div className="profile-upload-indicator">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        
        <input 
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
        />
        
        <div className="profile-info">
          <h3 className="profile-name">{userName}</h3>
          <div className="profile-edit">
            <Link to="/settings" className="profile-edit-link">
              <EditIcon fontSize="small" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <HomeIcon /> <span>Home</span>
        </Link>
        <Link to="/allTask" className="nav-item">
          <DashboardIcon /> <span>Dashboard</span>
        </Link>
        <Link to="/myTask" className="nav-item">
          <ListAltIcon /> <span>My Tasks</span>
        </Link>
        <Link to="/payments" className="nav-item">
          <PaymentIcon /> <span>Payments</span>
        </Link>
        <Link to="/notification" className="nav-item">
          <NotificationsIcon /> <span>Notifications</span>
        </Link>
        <Link to="/settings" className="nav-item settings-link">
          <SettingsIcon /> <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;