import React from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const AlertBanner = ({ alert, onDismiss }) => {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertColors = (level) => {
    switch (level) {
      case 'error':
        return 'bg-red-900 border-red-500 text-red-100';
      case 'warning':
        return 'bg-orange-900 border-orange-500 text-orange-100';
      case 'success':
        return 'bg-green-900 border-green-500 text-green-100';
      default:
        return 'bg-blue-900 border-blue-500 text-blue-100';
    }
  };

  return (
    <div className={`border-l-4 p-4 ${getAlertColors(alert.level)} animate-in slide-in-from-top duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getAlertIcon(alert.level)}
          <div>
            <p className="font-medium">{alert.message}</p>
            <p className="text-sm opacity-75">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-black/20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;