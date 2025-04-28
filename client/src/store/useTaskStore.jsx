import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useTaskStore = create((set, get) => ({
  taskForm: {
    taskTitle: '',
    onDate: null,
    beforeDate: null,
    isFlexible: false,
    description: '',
    location: '',
    budget: {
      amount: '',
      currency: 'USD'
    },
    additionalInfo: '',
    images: [],
    category: 'general'
  },
  
  isSubmitting: false,
  lastError: null,
  
  updateTaskForm: (data) => set((state) => ({
    taskForm: {
      ...state.taskForm,
      ...data
    }
  })),
  
  updateBudget: (budgetData) => set((state) => ({
    taskForm: {
      ...state.taskForm,
      budget: {
        ...state.taskForm.budget,
        ...budgetData
      }
    }
  })),
  
  addImages: (newImages) => set((state) => ({
    taskForm: {
      ...state.taskForm,
      images: [...state.taskForm.images, ...newImages]
    }
  })),
  
  removeImage: (index) => set((state) => {
    const newImages = [...state.taskForm.images];
    newImages.splice(index, 1);
    return {
      taskForm: {
        ...state.taskForm,
        images: newImages
      }
    };
  }),
  
  resetTaskForm: () => set({
    taskForm: {
      taskTitle: '',
      onDate: null,
      beforeDate: null,
      isFlexible: false,
      description: '',
      location: '',
      budget: {
        amount: '',
        currency: 'USD'
      },
      additionalInfo: '',
      images: [],
      category: 'general'
    },
    isSubmitting: false,
    lastError: null
  }),
  
  formatDate: (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(14, 0, 0, 0); 
    return d.toISOString();
  },
  
  submitTask: async (getToken, navigate) => {
    const { taskForm, formatDate } = get();
    
    set({ isSubmitting: true, lastError: null });
    
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication required');
        set({ lastError: 'Authentication required', isSubmitting: false });
        navigate('/login');
        return false;
      }
      
      const taskData = {
        taskName: taskForm.taskTitle || "Untitled Task",
        flexibleDate: Boolean(taskForm.isFlexible),
        description: taskForm.description + 
          (taskForm.additionalInfo ? `\n\n${taskForm.additionalInfo}` : ''),
        location: taskForm.location || "No location specified",
        status: "PENDING",
        budget: parseFloat(taskForm.budget?.amount) || 0,
        category: {
          name: taskForm.category || "general"
        }
      };
      
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      if (taskForm.onDate) {
        taskData.taskDate = formatDate(taskForm.onDate);
        taskData.dueDate = formatDate(taskForm.onDate);
      } 
      else if (taskForm.beforeDate) {
        taskData.taskDate = formatDate(today);
        taskData.dueDate = formatDate(taskForm.beforeDate);
      } 
      else {
        taskData.taskDate = formatDate(today);
        taskData.dueDate = formatDate(nextWeek);
      }
      
      console.log('Task data being submitted:', taskData);
      const formDataToSend = new FormData();
      
      formDataToSend.append('task', new Blob([JSON.stringify(taskData)], { 
        type: 'application/json' 
      }));
      
      if (taskForm.images && taskForm.images.length > 0) {
        taskForm.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      } else {
        formDataToSend.append('images', new Blob([], { type: 'application/octet-stream' }));
      }
      
      const response = await axios.post(
        'http://localhost:9193/api/v1/tasks/add',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Task created successfully:', response.data);
      toast.success('Task created successfully!');
      get().resetTaskForm();
      navigate('/myTask');
      
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      
      let errorMessage = 'Failed to create task';
      if (error.response) {
        console.error('Server response:', error.response.data);
        errorMessage = error.response.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      
      set({ lastError: errorMessage });
      toast.error(errorMessage);
      
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
  
  tasks: [],
  isLoadingTasks: false,
  tasksError: null,
  
  fetchAllTasks: async (getToken) => {
    set({ isLoadingTasks: true, tasksError: null });
    try {
      const token = getToken();
      if (!token) {
        set({ 
          tasksError: 'Authentication required', 
          isLoadingTasks: false 
        });
        return;
      }
      
      const response = await axios.get('http://localhost:9193/api/v1/tasks/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API response:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        set({ 
          tasks: response.data.data,
          isLoadingTasks: false
        });
      } else {
        console.warn('Unexpected API response format:', response.data);
        set({ 
          tasks: [],
          tasksError: 'Received unexpected data format from API',
          isLoadingTasks: false
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ 
        tasksError: error.message || 'Failed to fetch tasks',
        isLoadingTasks: false
      });
    }
  },
  
  fetchMyPostedTasks: async (getToken) => {
    set({ isLoadingTasks: true, tasksError: null });
    try {
      const token = getToken();
      if (!token) {
        set({ 
          tasksError: 'Authentication required', 
          isLoadingTasks: false 
        });
        return;
      }
      
      const response = await axios.get('http://localhost:9193/api/v1/tasks/my-posted-tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('My Posted Tasks API response:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        set({ 
          tasks: response.data.data,
          isLoadingTasks: false
        });
      } else {
        console.warn('Unexpected API response format:', response.data);
        set({ 
          tasks: [],
          tasksError: 'Received unexpected data format from API',
          isLoadingTasks: false
        });
      }
    } catch (error) {
      console.error('Error fetching my posted tasks:', error);
      set({ 
        tasksError: error.message || 'Failed to fetch my posted tasks',
        isLoadingTasks: false
      });
    }
  },
  
  currentTask: null,
  isLoadingTask: false,
  taskError: null,
  
  fetchTaskById: async (taskId, getToken) => {
    set({ isLoadingTask: true, taskError: null });
    
    try {
      const token = getToken();
      
      if (!token) {
        set({ 
          taskError: 'Authentication required', 
          isLoadingTask: false 
        });
        return;
      }
      
      const response = await axios.get(`http://localhost:9193/api/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Task details response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        set({ 
          currentTask: response.data.data,
          isLoadingTask: false
        });
      } else {
        console.warn('Unexpected API response format:', response.data);
        set({ 
          currentTask: null,
          taskError: 'Received unexpected data format from API',
          isLoadingTask: false
        });
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      set({ 
        taskError: error.response?.data?.message || error.message || 'Failed to fetch task',
        isLoadingTask: false
      });
    }
  },
  
  clearCurrentTask: () => {
    set({
      currentTask: null,
      taskError: null,
    });
  }
}));