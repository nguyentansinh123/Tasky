import React, { useState, useEffect } from 'react';
import '../css/MyTask.css';
import Card from '../../components/Card';
import TaskMap from '../taskmap/TaskMap';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import ImgDemo from '../../assets/TaskImageDemo.png';

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuthStore();
  const [taskLocations, setTaskLocations] = useState([]);

  const loadTaskImage = async (imageUrl) => {
    if (!imageUrl) return ImgDemo;
    
    try {
      const token = getToken();
      if (!token) return ImgDemo;
      
      const response = await fetch(`http://localhost:9193${imageUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status}`);
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error loading image:', err);
      return ImgDemo;
    }
  };

  useEffect(() => {
    const fetchMyTasks = async () => {
      console.log("Starting to fetch my tasks");
      setLoading(true);
      
      try {
        const token = getToken();
        if (!token) {
          console.log("No auth token available");
          setError('Authentication required');
          return;
        }

        console.log("Making API request to my-posted-tasks endpoint...");
        const response = await axios.get('http://localhost:9193/api/v1/tasks/my-posted-tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.success) {
          console.log("My tasks received:", response.data.data.length);
          
          const processedTasks = await Promise.all(
            response.data.data.map(async (task) => {
              let thumbnail = ImgDemo;
              if (task.images && task.images.length > 0) {
                thumbnail = await loadTaskImage(task.images[0].downloadUrl);
              }
              
              return {
                ...task,
                thumbnail,
                formattedDate: formatDate(task.dueDate)
              };
            })
          );
          
          setTasks(processedTasks);
          console.log("Tasks processed:", processedTasks.length);
          
          const locations = processedTasks.map((task, index) => ({
            location: task.location,
            title: task.taskName,
            label: String.fromCharCode(65 + index % 26) 
          }));
          
          setTaskLocations(locations);
        } else {
          throw new Error('Failed to load tasks');
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message || 'Error loading tasks');
        toast.error('Could not load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
    
    return () => {
      tasks.forEach(task => {
        if (task.thumbnail && task.thumbnail !== ImgDemo && typeof task.thumbnail === 'string' && task.thumbnail.startsWith('blob:')) {
          URL.revokeObjectURL(task.thumbnail);
        }
      });
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Flexible';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="task-card-container" style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div className="task-card" style={{
        flex: '1',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div className="task-header" style={{
          padding: '16px 20px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ 
            margin: '0', 
            color: '#333',
            fontSize: '1.5rem'
          }}>My Tasks</h2>
        </div>
        
        <div className="task-content" style={{ padding: '0 15px 15px' }}>
          {loading ? (
            <div className="loading" style={{
              padding: '30px 15px',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 15px'
              }}></div>
              Loading tasks...
            </div>
          ) : error ? (
            <div className="error" style={{
              padding: '20px',
              color: '#e74c3c',
              textAlign: 'center',
              backgroundColor: '#fdecea',
              borderRadius: '5px',
              margin: '15px 0'
            }}>
              Error: {error}
            </div>
          ) : tasks.length === 0 ? (
            <div className="no-tasks" style={{
              padding: '30px 15px',
              textAlign: 'center',
              color: '#666'
            }}>
              You haven't posted any tasks yet.
            </div>
          ) : (
            <div style={{ marginTop: '15px' }}>
              <p style={{
                margin: '0 0 15px',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                My tasks: {tasks.length}
              </p>
              {tasks.map(task => (
                <div key={task.id} style={{
                  border: '1px solid #eaeaea',
                  padding: '15px',
                  margin: '15px 0',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  backgroundColor: 'white',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => window.location.href = `/task/${task.id}`}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ flex: '1', marginRight: '25px' }}>
                      <h3 style={{ 
                        margin: '0 0 10px', 
                        fontSize: '1.2rem',
                        color: '#333'
                      }}>
                        {task.taskName || "Untitled Task"}
                      </h3>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        margin: '8px 0',
                        fontSize: '0.9rem',
                        color: '#666'
                      }}>
                        <span style={{ 
                          backgroundColor: '#f1f1f1',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          marginRight: '8px',
                          fontSize: '0.8rem'
                        }}>
                          {task.status || "PENDING"}
                        </span>
                        
                        {task.category?.name && (
                          <span style={{ 
                            backgroundColor: '#e8f4fd',
                            color: '#0077cc',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {task.category.name}
                          </span>
                        )}
                      </div>
                      
                      <p style={{ 
                        margin: '8px 0', 
                        fontSize: '0.9rem', 
                        color: '#555', 
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                          <path fill="#666" d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z" />
                        </svg>
                        {task.location || "No location"}
                      </p>
                      
                      <p style={{ 
                        margin: '8px 0', 
                        fontSize: '0.9rem', 
                        color: '#555',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                          <path fill="#666" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                        </svg>
                        {task.formattedDate || "No date"}
                      </p>
                      
                      <p style={{ 
                        margin: '8px 0', 
                        fontSize: '0.9rem', 
                        color: '#555',
                        fontWeight: '600'
                      }}>
                        ${parseFloat(task.budget).toFixed(2)}
                      </p>
                    </div>
                    
                    <div style={{ 
                      width: '120px',
                      height: '120px',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      marginLeft: '10px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <img 
                        src={task.thumbnail || ImgDemo} 
                        alt={`Task ${task.id}`} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }}
                        onError={(e) => { 
                          console.log(`Image error for task ${task.id}`);
                          e.target.src = ImgDemo;
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ 
        flex: '1',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minHeight: '500px',
        height: '80vh'
      }}>
        <TaskMap taskLocations={taskLocations} />
      </div>
    </div>
  );
};

export default MyTask;