import React from 'react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NotificationsIcon from '@mui/icons-material/Notifications';
import "../pages/css/Navbar.css"; // Import the CSS file
import { Link } from 'react-router-dom';

const Navbar = () => {
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
                <ChatBubbleIcon className='navbar-icon'/>
                <div className="notification-wrapper">
                    <NotificationsIcon className='navbar-icon'/>
                    <span className="notification-badge">3</span>
                </div>
            </div>
            <div className="navbar-profile">
                <img 
                    src="https://img.freepik.com/premium-vector/cute-avatar-akita-head-simple-cartoon-vector-illustration-dog-breeds-nature-concept-icon-isolated_772770-320.jpg" 
                    className='navbar-profile-pic' 
                    alt="User profile" 
                />
                <p className='navbar-username'>Username</p>
            </div>
            <Link to={"/createTask"} className='navbar-button'>Create Task</Link>
        </div>
    </nav>
  )
}

export default Navbar;