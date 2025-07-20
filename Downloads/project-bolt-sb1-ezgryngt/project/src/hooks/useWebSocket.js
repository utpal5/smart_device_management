import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    activeVisitors: 0,
    totalSessions: 0,
    activeSessions: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connectSocket = () => {
      const newSocket = io('http://localhost:3001', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        setSocket(newSocket);
        
        // Clear any pending reconnection attempts
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectSocket();
        }, 3000);
      });

      newSocket.on('visitor_update', (data) => {
        setAnalytics(data.analytics);
      });

      newSocket.on('analytics_update', (data) => {
        setAnalytics(data.analytics);
      });

      newSocket.on('session_activity', (data) => {
        if (data.activity) {
          setRecentActivity(data.activity);
        }
      });

      newSocket.on('user_connected', (data) => {
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'user_connected',
          message: 'New visitor connected',
          timestamp: data.timestamp
        }, ...prev.slice(0, 49)]);
      });

      newSocket.on('user_disconnected', (data) => {
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'user_disconnected',
          message: 'Visitor disconnected',
          timestamp: data.timestamp
        }, ...prev.slice(0, 49)]);
      });

      newSocket.on('alert', (alertData) => {
        setAlerts(prev => [{
          id: Date.now(),
          ...alertData
        }, ...prev.slice(0, 9)]);
        
        // Auto-remove alert after 10 seconds
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== Date.now()));
        }, 10000);
      });

      return newSocket;
    };

    const socketInstance = connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketInstance?.disconnect();
    };
  }, []);

  const trackAction = (actionName, actionData = {}) => {
    if (socket?.connected) {
      socket.emit('track_dashboard_action', {
        name: actionName,
        data: actionData,
        timestamp: Date.now()
      });
    }
  };

  const requestDetailedStats = () => {
    if (socket?.connected) {
      socket.emit('request_detailed_stats');
    }
  };

  const sendAlert = (alertData) => {
    if (socket?.connected) {
      socket.emit('alert', alertData);
    }
  };

  return {
    socket,
    isConnected,
    analytics,
    recentActivity,
    alerts,
    trackAction,
    requestDetailedStats,
    sendAlert
  };
};