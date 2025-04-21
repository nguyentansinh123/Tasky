import React from 'react'
import '../css/SingleTask.css'

const SingleTask = () => {
    return (
        <div className="task-page">
          {/* Left side - Task information */}
          <div className="task-info">
            <div className="task-tabs">
              <span className="task-tab active">OPEN</span>
              <span className="task-tab">ASSIGNED</span>
              <span className="task-tab">COMPLETED</span>
              <span className="task-tab follow">Follow</span>
            </div>
    
            <h1 className="task-title">Hang some pictures curtain brackets</h1>
    
            <div className="task-meta">
              <div className="meta-row return-link">
                <span>Return to map</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">POSTED BY</span>
                <span className="meta-value">Vanessa V.</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">LOCATION</span>
                <span className="meta-value">Newtown NSW, Australia</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">TO BE DONE ON</span>
                <span className="meta-value">Flexible</span>
              </div>
            </div>
    
            <div className="task-details">
              <h2 className="details-title">Details</h2>
              <p>Need 3 sets of curtain brackets (6 total) + two ceramic artworks put up on double brick walls.</p>
              <p>Need person to supply own drill plus screws/hooks etc.</p>
              <p>The ceramic artworks already have holes drilled in them (see picture)</p>
            </div>
    
            <div className="task-divider">
            </div>
    
            {/* Image Will be here */}
            <div className="task-actions">
              <button className="offers-button">Offers</button>
            </div>
          </div>
    
          {/* Right side - Map placeholder */}
          <div className="task-map">
            <div className="map-placeholder">
              <p>Map will go here</p>
              <div className="map-controls">
                <span className="map-control active">Map</span>
                <span className="map-control">Satellite</span>
              </div>
              {/* Map content would be rendered here */}
            </div>
          </div>
        </div>
      );
}

export default SingleTask