import React, { useEffect } from 'react';
import Card from '../../components/Card';
import '../css/AllTask.css';
import SearchBar from '../../components/SearchBar';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useTaskStore } from '../../store/useTaskStore';

const AllTask = () => {
  const { getToken } = useAuthStore();
  const { tasks, isLoadingTasks, tasksError, fetchAllTasks } = useTaskStore();

  useEffect(() => {
    fetchAllTasks(getToken);
  }, [fetchAllTasks, getToken]);

  return (
    <div className="all-tasks-page">
      <SearchBar />
      
      {isLoadingTasks && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      )}
      
      {tasksError && !isLoadingTasks && (
        <div className="error-container">
          <p className="error-message">{tasksError}</p>
          <button className="retry-button" onClick={() => fetchAllTasks(getToken)}>
            Retry
          </button>
        </div>
      )}
      
      {!isLoadingTasks && !tasksError && tasks.length === 0 && (
        <div className="no-tasks-container">
          <p className="no-tasks-message">No tasks found</p>
          <Link to="/createTask" className="create-task-button">
            Create a Task
          </Link>
        </div>
      )}
      
      {!isLoadingTasks && !tasksError && tasks.length > 0 && (
        <div className="all-tasks-container">
          <div className="all-tasks-grid">
            {tasks.map(task => (
              <Link 
                key={task.id} 
                to={`/task/${task.id}`} 
                className="task-card-link"
              >
                <Card task={task} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTask;