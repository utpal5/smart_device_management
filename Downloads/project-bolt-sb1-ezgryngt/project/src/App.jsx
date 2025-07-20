import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
import Navigation from './components/Navigation';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { trackAction } = useWebSocket();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'sessions':
        return <Sessions />;
      case 'analytics':
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
            <p className="text-gray-400">Coming soon... Enhanced analytics dashboard</p>
          </div>
        </div>;
      case 'settings':
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-400">Dashboard configuration options</p>
          </div>
        </div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        trackAction={trackAction}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;