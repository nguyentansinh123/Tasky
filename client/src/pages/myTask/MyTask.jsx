import React from 'react'
import '../css/MyTask.css'
import Card from '../../components/Card';


const MyTask = () => {
    return (
        <div className="task-card-container">
          <div className="task-card">
            <div className="task-header">
              <h2>My Task</h2>
            </div>
            
            <div className="task-content">
                <Card/>
            </div>
          </div>
          
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

export default MyTask