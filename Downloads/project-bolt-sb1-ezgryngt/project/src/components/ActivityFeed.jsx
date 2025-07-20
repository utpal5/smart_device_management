import React from 'react';
import { User, UserX, MousePointer, AlertTriangle, Clock } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_connected':
        return <User className="h-4 w-4 text-green-400" />;
      case 'user_disconnected':
        return <UserX className="h-4 w-4 text-red-400" />;
      case 'dashboard_action':
        return <MousePointer className="h-4 w-4 text-blue-400" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_connected':
        return 'border-green-500';
      case 'user_disconnected':
        return 'border-red-500';
      case 'dashboard_action':
        return 'border-blue-500';
      case 'alert':
        return 'border-orange-500';
      default:
        return 'border-gray-500';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Real-Time Activity Feed
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Live updates from your visitors
        </p>
      </div>
      
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Waiting for visitor interactions...</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.slice(0, 20).map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-3 p-3 rounded-lg bg-gray-700/50 border-l-2 ${getActivityColor(activity.type)} transition-all duration-200 hover:bg-gray-700/70`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    {activity.message}
                  </p>
                  {activity.sessionId && (
                    <p className="text-xs text-gray-400 mt-1">
                      Session: {activity.sessionId.substring(0, 8)}...
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;