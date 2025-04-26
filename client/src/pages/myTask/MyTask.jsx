import React from 'react'
import '../css/MyTask.css'
import Card from '../../components/Card'
import TaskMap from '../taskmap/TaskMap'

const MyTask = () => {
  // Sample task locations with location names instead of coordinates
  const taskLocations = [
    {
      location: "Sydney, NSW, Australia",
      title: "Website Development Task",
      label: "A"
    },
    {
      location: "Melbourne, VIC, Australia",
      title: "Logo Design Project",
      label: "B"
    },
    {
      location: "Wollongong, NSW, Australia",
      title: "Content Writing Task",
      label: "C"
    }
  ];

  return (
    <div className="task-card-container">
      <div className="task-card">
        <div className="task-header">
          <h2>My Tasks</h2>
        </div>
        
        <div className="task-content">
          <Card />
          <Card />
        </div>
      </div>
      
      <TaskMap taskLocations={taskLocations} />
    </div>
  );
}

export default MyTask