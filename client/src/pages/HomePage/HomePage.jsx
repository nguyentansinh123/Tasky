import React from 'react';
import '../css/HomePage.css';
import teamImage from '../../assets/bg.jpg';

const HomePage = () => {
  return (
    <div className="homepage-container">
      
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Task you need to complete ...</h1>
            <p>The only platform that gives your team all the tools needed to work together on and awesome projects.</p>
            
            <div className="email-signup">
              <input type="email" placeholder="Enter your email" className="email-input" />
              <button className="signup-button">Sign up Free</button>
            </div>
            
            <div className="tech-tags">
              <div className="tag"><span>SKILLS</span></div>
              <div className="tag"><span>ShieldTask</span></div>
              <div className="tag"><span>AIPower</span></div>
              <div className="tag"><span>WORKS</span></div>
            </div>
          </div>
          <div className="hero-image">
          <img src={teamImage} alt="Team collaborating on a laptop" />
          </div>
        </div>
      </section>
      
      <section className="services-section">
        <h2>Expanding services</h2>
        
        <div className="service-icons">
          <div className="service-item">
            <div className="icon-container trophy">
              <i className="fas fa-trophy"></i>
            </div>
            <p>Nish viverra</p>
          </div>
          
          <div className="service-item">
            <div className="icon-container chat">
              <i className="fas fa-comment-alt"></i>
            </div>
            <p>Cursus amet</p>
          </div>
          
          <div className="service-item">
            <div className="icon-container note">
              <i className="fas fa-sticky-note"></i>
            </div>
            <p>Ipsum fermentum</p>
          </div>
          
          <div className="service-item">
            <div className="icon-container star">
              <i className="fas fa-star"></i>
            </div>
            <p>Quisque maximus</p>
          </div>
          
          <div className="service-item">
            <div className="icon-container megaphone">
              <i className="fas fa-bullhorn"></i>
            </div>
            <p>Arcu vulputate</p>
          </div>
          
          <div className="service-item">
            <div className="icon-container document">
              <i className="fas fa-file"></i>
            </div>
            <p>Class auctor</p>
          </div>
        </div>
        
        <div className="services-cta">
          <button className="find-services-btn">Find Services</button>
        </div>
      </section>
      
      <section className="features-section">
        <h2>Seasoned. Nimble. Remote.</h2>
        <p>
          We're a global team of top-tier talent covering all aspects of your design and development needs.
          Just tell us what you need, and we'll connect you with the right talent.
        </p>
        
        <div className="features-buttons">
          <button className="insights-btn">Insights</button>
          <button className="contact-btn">Contact</button>
        </div>
      </section>
      
      <footer className="homepage-footer">
        <div className="footer-logo">
          <h2>LIFT</h2>
        </div>
        
        <div className="copyright">
          © 2023 by LIFT. All Rights Reserved.
        </div>
        
        <div className="social-links">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;