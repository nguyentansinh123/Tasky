import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.css';
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });
    
    const [verificationMode, setVerificationMode] = useState(false);
    const [verificationToken, setVerificationToken] = useState('');
    const { register, verifyEmail, isSigningUp } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return false;
        }
        
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
        };
        
        const result = await register(userData);
        
        if (result.success) {
            setVerificationMode(true);
        }
    };
    
    const handleVerification = async (e) => {
        e.preventDefault();
        
        if (!verificationToken.trim()) {
            toast.error("Please enter the verification token");
            return;
        }
        
        const result = await verifyEmail(verificationToken);
        
        if (result.success) {
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
    };

    return (
        <div className="signup-container">
          <div className="signup-form-section">
            {!verificationMode ? (
                <>
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
                            placeholder="Create password (min. 8 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="form-input"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="signup-btn"
                        disabled={isSigningUp}
                      >
                        {isSigningUp ? "Creating Account..." : "Create an account"}
                      </button>
                    </form>
                </>
            ) : (
                <>
                    <h1 className="signup-title">Verify Your Email</h1>
                    <p className="verification-instructions">
                        We've sent a verification link to your email address: <strong>{formData.email}</strong>. 
                        Please check your inbox and enter the verification token below.
                    </p>
                    
                    <form className="signup-form" onSubmit={handleVerification}>
                      <div className="compact-form">
                        <div className="form-group">
                          <label htmlFor="verificationToken" className="form-label">Verification Token</label>
                          <input
                            type="text"
                            id="verificationToken"
                            className="form-input"
                            placeholder="Enter the token from your email"
                            value={verificationToken}
                            onChange={(e) => setVerificationToken(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <button type="submit" className="signup-btn">
                        Verify Email
                      </button>
                    </form>
                    
                    <p className="verification-note">
                        Didn't receive an email? Check your spam folder or 
                        <button 
                          className="resend-button"
                          onClick={() => {
                              const userData = {
                                  firstName: formData.firstName,
                                  lastName: formData.lastName,
                                  email: formData.email,
                                  password: formData.password
                              };
                              register(userData);
                              toast.success("Verification email sent again!");
                          }}
                        >
                          resend the verification email
                        </button>
                    </p>
                </>
            )}
            
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

export default Register;