import React from 'react'
import '../css/LogIn.css'

const LogIn = () => {
    return(
        <div className="signIn_Container">
          <div className="signIn_Container_Wrapper">
            {/* Left Column - Form */}
            <div className="signIn_Container_Wrapper_FormSection">
              <h1 className="signIn_Container_Wrapper_Title">Welcome to App name</h1>
              <p className="signIn_Container_Wrapper_Subtitle">
                Kindly fill in your details below to create an account
              </p>
    
              <form className="signIn_Container_Wrapper_Form">
                <div className="signIn_Container_Wrapper_FormField">
                  <label className="signIn_Container_Wrapper_FormLabel">Email Address</label>
                  <input 
                    type="email" 
                    className="signIn_Container_Wrapper_FormInput" 
                    value="Daphne Smith"
                  />
                </div>
    
                <div className="signIn_Container_Wrapper_FormField">
                  <label className="signIn_Container_Wrapper_FormLabel">Password</label>
                  <input 
                    type="password" 
                    className="signIn_Container_Wrapper_FormInput" 
                    placeholder="••••••••" 
                  />
                </div>
    
                <button type="submit" className="signIn_Container_Wrapper_SubmitButton">
                  Register with us
                </button>
              </form>
    
              <p className="signIn_Container_Wrapper_LoginPrompt">
                Already have an account? <a href="#" className="signIn_Container_Wrapper_LoginLink">Login</a>
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