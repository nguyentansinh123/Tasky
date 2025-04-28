import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import { FaCat, FaSearch, FaSpinner, FaUserCircle, FaPaperPlane, FaCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../css/ChatApp.css';

window.global = window;

const ChatApp = () => {
  const { authUser, getToken } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionError, setConnectionError] = useState(null);
  
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const forceEnableInput = () => {
    console.log("Force enabling input");
    setIsConnected(true);
  };

  useEffect(() => {
    if (stompClient.current?.connected) {
      setIsConnected(true);
      console.log("STOMP client is connected, enabling input");
    } else {
      console.log("STOMP client status:", stompClient.current?.connected);
    }
  }, [stompClient.current?.connected]);

  useEffect(() => {
    connectToChat();
    
    return () => {
      disconnectFromChat();
    };
  }, []);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      
      setAvailableUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, hasNewMessages: false } 
            : user
        )
      );
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectToChat = () => {
    try {
      if (stompClient.current?.connected) {
        console.log("Already connected");
        setIsConnected(true);
        return;
      }
      
      setTimeout(() => {
        if (!isConnected) {
          forceEnableInput();
        }
      }, 5000);
      
      const token = getToken();
      if (!token) {
        toast.error("You must be logged in to use chat");
        return;
      }

      import('sockjs-client').then(SockJSModule => {
        const SockJS = SockJSModule.default;
        const socket = new SockJS('http://localhost:9193/ws');
        
        stompClient.current = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            'Authorization': `Bearer ${token}`
          },
          debug: function (str) {
            console.log('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000
        });

        stompClient.current.onConnect = (frame) => {
          console.log('Connected to WebSocket: ', frame);
          setIsConnected(true);
          setConnectionError(null);
          toast.success("Connected to chat server");
          
          if (authUser && authUser.id) {
            stompClient.current.subscribe(`/user/${authUser.id}/queue/messages`, (response) => {
              try {
                const receivedMessage = JSON.parse(response.body);
                console.log('Received message:', receivedMessage);
                
                if (selectedUser && receivedMessage.senderId === selectedUser.id) {
                  setMessages(prevMessages => [...prevMessages, receivedMessage]);
                } else {
                  setAvailableUsers(prevUsers => 
                    prevUsers.map(user => 
                      user.id === receivedMessage.senderId 
                        ? { ...user, hasNewMessages: true } 
                        : user
                    )
                  );
                  
                  const sender = availableUsers.find(user => user.id === receivedMessage.senderId);
                  const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Someone";
                  toast.success(`New message from ${senderName}`);
                }
              } catch (error) {
                console.error('Error processing received message:', error);
              }
            });
          } else {
            console.error('User ID is missing, cannot subscribe to message queue');
          }
        };

        stompClient.current.onStompError = (frame) => {
          console.error('STOMP error', frame);
          setIsConnected(false);
          setConnectionError(`Connection error: ${frame.headers?.message || 'Unknown error'}`);
          toast.error(`Chat connection error: ${frame.headers?.message || 'Please try again'}`);
        };

        stompClient.current.onWebSocketError = (event) => {
          console.error('WebSocket error', event);
          setIsConnected(false);
          setConnectionError('WebSocket connection failed');
          toast.error('Failed to connect to chat server');
        };

        stompClient.current.activate();
      }).catch(error => {
        console.error('Error loading SockJS:', error);
        setConnectionError('Failed to load chat service');
        toast.error("Failed to initialize chat service");
      });
    } catch (error) {
      console.error('Error in connectToChat:', error);
      setConnectionError('Chat initialization error');
      toast.error("An error occurred while setting up chat");
    }
  };

  const disconnectFromChat = () => {
    try {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.deactivate();
      }
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting from chat:', error);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get('http://localhost:9193/api/v1/chat/users/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Available users response:', response.data);

      if (response.data && response.data.success) {
        setAvailableUsers(response.data.data.map(user => ({
          ...user,
          hasNewMessages: false
        })));
      } else {
        console.warn('Unexpected response format from users API:', response.data);
        toast.error(response.data?.message || "Couldn't load users");
      }
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast.error("Couldn't load users. Please try again.");
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get(
        `http://localhost:9193/api/v1/chat/messages/${selectedUser.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Messages response:', response.data);

      if (response.data && response.data.success) {
        setMessages(response.data.data);
      } else {
        console.warn('Unexpected response format from messages API:', response.data);
        toast.error(response.data?.message || "Couldn't load messages");
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error("Couldn't load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!selectedUser || message.trim() === '') return;
    
    if (!isConnected) {
      toast.error("Not connected to chat server. Please wait or refresh the page.");
      return;
    }

    try {
      const chatMessage = {
        senderId: authUser.id,
        receiverId: selectedUser.id,
        content: message.trim(),
        timestamp: new Date()
      };

      console.log('Sending message:', chatMessage);

      stompClient.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(chatMessage),
        headers: { 'content-type': 'application/json' }
      });

      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          ...chatMessage, 
          id: `temp-${Date.now()}` // Temporary ID for the UI
        }
      ]);
      setMessage('');
      
      messageInputRef.current?.focus();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Couldn't send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const filteredUsers = searchTerm.trim() 
    ? availableUsers.filter(user => 
        user && `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableUsers;

  return (
    <div className="chat-app">
      <div className="chat-container">
        <div className="sidebar">
          <h2>Messages</h2>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="online-users">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={`${user.firstName} profile`} />
                    ) : (
                      <FaUserCircle className="user-icon" />
                    )}
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {user.firstName} {user.lastName}
                    </span>
                    {user.hasNewMessages && <span className="new-badge">New</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-users">
                {searchTerm ? "No matches found" : "No users available"}
              </div>
            )}
          </div>
          
          <div className="logged-info">
            <div>Logged in as:</div>
            <div className="current-user">
              {authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Loading...'}
            </div>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              <FaCircle size={8} style={{marginRight: '5px'}} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
        
        <div className="chat-main">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  {selectedUser.profileImage ? (
                    <img 
                      src={selectedUser.profileImage} 
                      alt={`${selectedUser.firstName} profile`} 
                      className="chat-user-image"
                    />
                  ) : (
                    <FaUserCircle className="chat-user-icon" />
                  )}
                  <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
                </div>
              </div>
              
              <div className="chat-messages">
                {isLoading ? (
                  <div className="loading-messages">
                    <FaSpinner className="spinner" />
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div 
                      key={msg.id || index} 
                      className={`message ${msg.senderId === authUser.id ? 'user-message' : 'other-message'}`}
                    >
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e)}
                  className="message-input"
                  disabled={false} 
                  ref={messageInputRef}
                />
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={!isConnected || message.trim() === ''}
                >
                  <FaPaperPlane size={16} />
                </button>
                {!isConnected && (
                  <button 
                    type="button"
                    className="retry-button"
                    onClick={forceEnableInput}
                  >
                    Unlock Input
                  </button>
                )}
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <FaCat size={64} className="no-chat-icon" />
              <p>Select a user to start chatting</p>
              {connectionError && (
                <p className="connection-error">{connectionError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;