import React, { useState, useEffect } from 'react';
import { Users, Clock, Globe, Monitor, MapPin, Calendar } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

const Sessions = () => {
  const { trackAction } = useWebSocket();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackAction('page_view', { page: 'sessions' });
    
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/analytics/sessions');
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);

    return () => clearInterval(interval);
  }, [trackAction]);

  const formatDuration = (duration) => {
    const seconds = Math.floor(duration / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStartTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-500" />
            Active Sessions
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time visitor sessions and activity
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Active Sessions</h3>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {sessions.length}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Total Page Views</h3>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {sessions.reduce((sum, session) => sum + session.pageViews, 0)}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Avg. Duration</h3>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {sessions.length > 0 
                ? formatDuration(sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length)
                : '0:00'
              }
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Session Details</h3>
            <p className="text-sm text-gray-400 mt-1">
              Live session information and metrics
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Active Sessions</h3>
              <p className="text-gray-500">Waiting for visitors to connect...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Page Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Device
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-mono text-gray-300">
                            {session.id.substring(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatStartTime(session.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {formatDuration(session.duration)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Globe className="h-4 w-4 text-gray-500" />
                          {session.pageViews}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {session.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Monitor className="h-4 w-4 text-gray-500" />
                          {session.device}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;