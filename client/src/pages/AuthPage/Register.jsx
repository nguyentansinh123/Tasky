import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Register.css'
import GoogleIcon from "@mui/icons-material/Google";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add registration logic here
    };

    return (
        <div className="signup-container">
          <div className="signup-form-section">
            <h1 className="signup-title">Create an account</h1>
            
            <button className="google-signup-btn">
              <GoogleIcon fontSize='medium' className='signup_icon_register'/>
              Create account with Google
            </button>
            
            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-text">or</span>
              <span className="divider-line"></span>
            </div>
            
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="compact-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-input"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group half-width">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-input"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="signup-btn">
                Create an account
              </button>
            </form>
            
            <p className="login-prompt">
              Already have an account? <Link to="/login" className="login-link">Login</Link>
            </p>
          </div>
          
          <div className="signup-hero-section">
            <h2 className="hero-title">Wander. Unwind. Your Journey Begins Here</h2>
            <p className="hero-text">
              Whether you seek the thrill of uncharted paths or the tranquility of breathtaking landscapes, 
              our traveling community is your passport to a world of endless possibilities. 
              Your extraordinary voyage starts now.
            </p>
            <p className="hero-text">
              Join thousands of travelers who have already discovered new destinations, 
              made lifelong connections, and created memories that last forever.
            </p>
          </div>
        </div>
    );
}

export default Register