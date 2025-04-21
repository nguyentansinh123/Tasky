import React, { useState } from 'react';
import '../css/CreateTask.css';
import ProgressBar from '../../components/ProgressBar';
import Navbar from '../../components/Navbar';

const CreateTask = ({ onNext, onBack }) => {
  const [taskData, setTaskData] = useState({
    onDate: '',
    beforeDate: '',
    isFlexible: false,
    taskTitle: ''
  });

  const [showOnDateCalendar, setShowOnDateCalendar] = useState(false);
  const [showBeforeDateCalendar, setShowBeforeDateCalendar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value,
      isFlexible: false // Turn off flexible when selecting dates
    }));
  };

  const handleFlexibleToggle = () => {
    setTaskData(prev => ({
      ...prev,
      isFlexible: !prev.isFlexible,
      onDate: '',
      beforeDate: ''
    }));
  };

  // Placeholder function for calendar selection - to be implemented
  const handleDateSelect = (date, type) => {
    console.log(`Selected ${type} date:`, date);
    // This will be implemented when you add the calendar component
    if (type === 'onDate') {
      setTaskData(prev => ({ ...prev, onDate: date }));
      setShowOnDateCalendar(false);
    } else {
      setTaskData(prev => ({ ...prev, beforeDate: date }));
      setShowBeforeDateCalendar(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.onDate && !taskData.beforeDate && !taskData.isFlexible) {
      alert('Please select a deadline option');
      return;
    }
    if (!taskData.taskTitle) {
      alert('Please enter a task title');
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="create-task-container">
        <form onSubmit={handleSubmit}>
          <div className="task-content">
            <h2 className="section-title">Let's start with the basics</h2>
            
            <div className="form-group">
              <label className="form-label">When do you need it done?</label>
              <div className="date-options">
                <div className="date-option-group">
                  <select 
                    className="date-select" 
                    name="onDate"
                    value={taskData.onDate}
                    onChange={handleChange}
                    onClick={() => setShowOnDateCalendar(true)}
                  >
                    <option value="">On date</option>
                    <option value="specific">Select date</option>
                  </select>
                  {showOnDateCalendar && (
                    <div className="calendar-placeholder">
                      {/*Calendar component will go here */}
                    </div>
                  )}
                </div>

                <div className="date-option-group">
                  <select 
                    className="date-select" 
                    name="beforeDate"
                    value={taskData.beforeDate}
                    onChange={handleChange}
                    onClick={() => setShowBeforeDateCalendar(true)}
                  >
                    <option value="">Before date</option>
                    <option value="specific">Select date</option>
                  </select>
                  {/* Calendar will be inserted here */}
                  {showBeforeDateCalendar && (
                    <div className="calendar-placeholder">
                      {/* Replace this div with your calendar component */}
                      {/* <p>Calendar component will go here</p> */}
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  className={`date-option-flexible ${taskData.isFlexible ? 'active' : ''}`}
                  onClick={handleFlexibleToggle}
                >
                  I'm flexible
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                In a few words, what do you need done?
              </label>
              <input 
                type="text" 
                className="task-input"
                name="taskTitle"
                placeholder="e.g. Help move my sofa"
                value={taskData.taskTitle}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              type="button" 
              className="nav-button back-button" 
              onClick={onBack}
              disabled
            >
              Back
            </button>
            <button type="submit" className="nav-button next-button">
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTask;