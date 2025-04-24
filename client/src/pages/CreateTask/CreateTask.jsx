import React, { useState } from 'react';
import '../css/CreateTask.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateTask = ({ onNext, onBack }) => {
  const [taskData, setTaskData] = useState({
    onDate: null,
    beforeDate: null,
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
      isFlexible: false 
    }));
  };

  const handleFlexibleToggle = () => {
    setTaskData(prev => ({
      ...prev,
      isFlexible: !prev.isFlexible,
      onDate: null,
      beforeDate: null
    }));
  };

  const handleDateSelect = (date, type) => {
    console.log(`Selected ${type} date:`, date);
    if (type === 'onDate') {
      setTaskData(prev => ({ 
        ...prev, 
        onDate: date, 
        beforeDate: null, 
        isFlexible: false 
      }));
      setShowOnDateCalendar(false);
    } else {
      setTaskData(prev => ({ 
        ...prev, 
        beforeDate: date, 
        onDate: null, 
        isFlexible: false 
      }));
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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
                  <button 
                    type="button"
                    className={`date-select ${taskData.onDate ? 'active' : ''}`}
                    onClick={() => setShowOnDateCalendar(!showOnDateCalendar)}
                  >
                    {taskData.onDate ? formatDate(taskData.onDate) : 'On date'}
                  </button>
                  {showOnDateCalendar && (
                    <div className="calendar-container">
                      <DatePicker
                        selected={taskData.onDate}
                        onChange={(date) => handleDateSelect(date, 'onDate')}
                        inline
                        minDate={new Date()}
                        calendarClassName="custom-calendar"
                      />
                    </div>
                  )}
                </div>

                <div className="date-option-group">
                  <button 
                    type="button"
                    className={`date-select ${taskData.beforeDate ? 'active' : ''}`}
                    onClick={() => setShowBeforeDateCalendar(!showBeforeDateCalendar)}
                  >
                    {taskData.beforeDate ? formatDate(taskData.beforeDate) : 'Before date'}
                  </button>
                  {showBeforeDateCalendar && (
                    <div className="calendar-container">
                      <DatePicker
                        selected={taskData.beforeDate}
                        onChange={(date) => handleDateSelect(date, 'beforeDate')}
                        inline
                        minDate={new Date()}
                        calendarClassName="custom-calendar"
                      />
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