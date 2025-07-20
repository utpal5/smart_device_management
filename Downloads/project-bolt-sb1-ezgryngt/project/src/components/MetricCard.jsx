import React from 'react';

const MetricCard = ({ title, value, icon: Icon, color, isLive = false, onClick }) => {
  return (
    <div 
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 transition-all duration-200 hover:border-gray-600 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {isLive && (
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}
      </div>
      {onClick && (
        <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Click for details
        </div>
      )}
    </div>
  );
};

export default MetricCard;