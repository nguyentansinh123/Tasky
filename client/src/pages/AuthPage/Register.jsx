import React from 'react'
import '../css/Register.css'
import GoogleIcon from "@mui/icons-material/Google";


const Register = () => {
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
            
            <form className="signup-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fullname" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Create your password"
                />
              </div>
              
              <button type="submit" className="signup-btn">
                Create an account
              </button>
            </form>
            
            <p className="login-prompt">
              Already have an account? <a href="#" className="login-link">Login</a>
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
              Whether you seek the thrill of uncharted paths or the tranquility of breathtaking landscapes,
            </p>
          </div>
        </div>
      );
}

export default Register