import { Client } from '@stomp/stompjs';
import { useAuthStore } from '../../store/useAuthStore';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = {};
    this.baseUrl = 'http://localhost:9193';
  }

  connect() {
    if (this.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const authUser = useAuthStore.getState().authUser;
      if (!authUser) {
        return reject('No authenticated user');
      }

      this.client = new Client({
        brokerURL: `ws://${this.baseUrl.replace(/^http(s?):\/\//, '')}/ws/websocket`,
        connectHeaders: {},
        debug: function(str) {
          if (process.env.NODE_ENV === 'development') {
            console.log(str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = () => {
        console.log('WebSocket connected');
        this.connected = true;
        
        this.client.subscribe(`/user/${authUser.email}/queue/notifications`, this.onNotificationReceived);
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('WebSocket STOMP error:', frame);
        reject(frame);
      };
      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }

  onNotificationReceived = (message) => {
    try {
      const notification = JSON.parse(message.body);
      console.log('Real-time notification received:', notification);
      
      const formattedNotification = {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        read: notification.read || false,
        createdAt: notification.createdAt,
        task: notification.task
      };
      
      Object.values(this.subscribers).forEach(callback => {
        callback(formattedNotification);
      });
    } catch (error) {
      console.error('Error handling notification message:', error);
    }
  }

  subscribe(id, callback) {
    this.subscribers[id] = callback;
    return () => {
      delete this.subscribers[id];
    };
  }
}

const websocketService = new WebSocketService();
export default websocketService;