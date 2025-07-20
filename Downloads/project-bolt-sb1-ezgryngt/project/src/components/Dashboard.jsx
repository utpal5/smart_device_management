import React, { useState, useEffect } from 'react';
import { Users, Activity, Globe, Clock, TrendingUp, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import MetricCard from './MetricCard';
import ActivityFeed from './ActivityFeed';
import TopPages from './TopPages';
import VisitorChart from './VisitorChart';
import AlertBanner from './AlertBanner';

const Dashboard = () => {
  const { isConnected, analytics, recentActivity, alerts, trackAction } = useWebSocket();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    trackAction('dashboard_view', { page: 'main_dashboard' });
  }, [trackAction]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const connectionStatus = isConnected ? (
    <div className="flex items-center gap-2 text-green-400">
      <Wifi size={16} />
      <span className="text-sm">Connected</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-red-400">
      <WifiOff size={16} />
      <span className="text-sm">Reconnecting...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>
            {connectionStatus}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </header>

      {/* Alert Banners */}
      {alerts.map(alert => (
        <AlertBanner key={alert.id} alert={alert} />
      ))}

      <div className="max-w-7xl mx-auto p-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Visitors"
            value={analytics.activeVisitors}
            icon={Users}
            color="bg-blue-500"
            isLive={true}
            onClick={() => trackAction('metric_click', { metric: 'active_visitors' })}
          />
          <MetricCard
            title="Total Sessions"
            value={analytics.totalSessions}
            icon={Globe}
            color="bg-purple-500"
            onClick={() => trackAction('metric_click', { metric: 'total_sessions' })}
          />
          <MetricCard
            title="Page Views"
            value={analytics.pageViews}
            icon={TrendingUp}
            color="bg-green-500"
            onClick={() => trackAction('metric_click', { metric: 'page_views' })}
          />
          <MetricCard
            title="Avg. Session"
            value={formatDuration(analytics.avgSessionDuration)}
            icon={Clock}
            color="bg-orange-500"
            onClick={() => trackAction('metric_click', { metric: 'avg_session' })}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Bounce Rate
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
              {(analytics.bounceRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              {analytics.bounceRate < 0.4 ? '↓ Good engagement' : '↑ Needs improvement'}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Total Visitors
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
              {analytics.totalVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              All time unique visitors
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Active Sessions
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
              {analytics.activeSessions}
            </div>
            <div className="text-sm text-gray-400">
              Currently browsing
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VisitorChart analytics={analytics} />
          <TopPages pages={analytics.topPages || []} />
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;