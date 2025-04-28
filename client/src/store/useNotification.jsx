import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';
import websocketService from '../pages/config/WebSocketService';

const apiUrl = 'http://localhost:9193/api/v1/notifications';


const USE_MOCK_DATA = false;  

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    message: "New task 'Fix the website' has been posted",
    type: "TASK_CREATED",
    read: false,
    createdAt: new Date().toISOString(),
    task: {
      id: 101,
      taskName: "Fix the website",
      budget: 100,
      uploaduser: {
        firstName: "John",
        lastName: "Doe",
        profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    }
  },
  {
    id: 2,
    message: "Your task 'Design new logo' has been accepted by Jane Smith",
    type: "TASK_ACCEPTED",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), 
    task: {
      id: 102,
      taskName: "Design new logo",
      budget: 200,
      uploaduser: {
        firstName: "Alex",
        lastName: "Johnson",
        profileImageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      }
    }
  }
];

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  initializeNotifications: () => {
    const unsubscribe = websocketService.subscribe('notificationStore', (notification) => {
      get().addNotification(notification);
    });
    
    websocketService.connect().catch(error => {
      console.error('Failed to connect to WebSocket:', error);
    });
    get().fetchNotifications();
    return unsubscribe;
  },
  
  fetchNotifications: async () => {
    set({ isLoading: true });
    
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        set({ 
          notifications: MOCK_NOTIFICATIONS,
          unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
          isLoading: false,
          error: null
        });
      }, 500);
      return;
    }
    
    try {
      const { token, authUser } = useAuthStore.getState();
      
      if (!token || !authUser) {
        console.error("No authentication token or user found");
        set({ 
          error: 'Authentication required', 
          isLoading: false 
        });
        return;
      }
      
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log("Fetching real notifications from backend...");
      const response = await axios.get(`${apiUrl}/me`, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Notification response:", response);
      
      const notifications = response.data.data || [];
      set({ 
        notifications,
        unreadCount: notifications.filter(notif => !notif.read).length,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      let errorMessage = 'Failed to fetch notifications';
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        errorMessage = error.response.data?.message || 
                      `Server error (${error.response.status})`;
        
        if (error.response.status === 401 || error.response.status === 403) {
          console.warn('Authentication issue detected - falling back to mock data');
          
          setTimeout(() => {
            set({ 
              notifications: MOCK_NOTIFICATIONS,
              unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
              isLoading: false,
              error: null
            });
          }, 500);
          return;
        }
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },
  
  addNotification: (notification) => {
    set(state => {
      const exists = state.notifications.some(n => n.id === notification.id);
      if (exists) return state;
      
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + (notification.read ? 0 : 1)
      };
    });
    
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  },
  
  markAsRead: async (notificationId) => {
    if (USE_MOCK_DATA) {
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      return { success: true };
    }
    
    try {
      const { token } = useAuthStore.getState();
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      
      const response = await axios.put(`${apiUrl}/${notificationId}/read`, {}, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  },
  
  markAllAsRead: async () => {
    if (USE_MOCK_DATA) {
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
      return true;
    }
    
    try {
      const { token } = useAuthStore.getState();
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
      
      const response = await axios.put(`${apiUrl}/read-all`, {}, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }
}));

export default useNotificationStore;