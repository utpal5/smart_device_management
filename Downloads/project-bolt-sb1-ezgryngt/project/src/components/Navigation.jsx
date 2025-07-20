import React from 'react';
import { Activity, Users, BarChart3, Settings } from 'lucide-react';

const Navigation = ({ currentView, onViewChange, trackAction }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'sessions', label: 'Sessions', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
    trackAction('navigation', { to: viewId });
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;