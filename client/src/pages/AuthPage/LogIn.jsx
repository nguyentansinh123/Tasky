import React, { useState } from 'react'
import '../css/LogIn.css'
import { Link, Links } from 'react-router-dom'

const LogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your login logic here
    };

    return(
        <div className="signIn_Container">
          <div className="signIn_Container_Wrapper">
            {/* Left Column - Form */}
            <div className="signIn_Container_Wrapper_FormSection">
              <h1 className="signIn_Container_Wrapper_Title">Welcome to App name</h1>
              <p className="signIn_Container_Wrapper_Subtitle">
                Kindly fill in your details below to sign in
              </p>
    
              <form className="signIn_Container_Wrapper_Form" onSubmit={handleSubmit}>
                <div className="signIn_Container_Wrapper_FormField">
                  <label className="signIn_Container_Wrapper_FormLabel">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="signIn_Container_Wrapper_FormInput" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
    
                <div className="signIn_Container_Wrapper_FormField">
                  <label className="signIn_Container_Wrapper_FormLabel">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="signIn_Container_Wrapper_FormInput" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
    
                <button type="submit" className="signIn_Container_Wrapper_SubmitButton">
                  Sign In
                </button>
              </form>
    
              <p className="signIn_Container_Wrapper_LoginPrompt">
                Don't have an account? <Link to="/register" className="signIn_Container_Wrapper_LoginLink">Register</Link>
              </p>
    
              <div className="signIn_Container_Wrapper_Divider">
                <span className="signIn_Container_Wrapper_DividerText">Or</span>
              </div>
            </div>
    
            {/* Right Column - Hero Text */}
            <div className="signIn_Container_Wrapper_HeroSection">
              <h2 className="signIn_Container_Wrapper_HeroTitle">
                Wander. Unwind. Your Journey Begins Here
              </h2>
              <p className="signIn_Container_Wrapper_HeroText">
                Whether you seek the thrill of uncharted paths or the tranquility of breathtaking landscapes, 
                our traveling community is your passport to a world of endless possibilities. 
                Your extraordinary voyage starts now.
              </p>
              <p className="signIn_Container_Wrapper_HeroText">
                Whether you seek the thrill of uncharted paths or the tranquility of breathtaking landscapes,
              </p>
            </div>
          </div>
        </div>
      );
}

export default LogIn