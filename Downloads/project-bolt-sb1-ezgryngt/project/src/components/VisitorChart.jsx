import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const VisitorChart = ({ analytics }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate sample chart data
    const now = new Date();
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const visitors = Math.floor(Math.random() * 50) + 10 + (i < 12 ? analytics.activeVisitors : 0);
      
      data.push({
        hour: hour.getHours(),
        visitors,
        label: `${hour.getHours().toString().padStart(2, '0')}:00`
      });
    }
    
    setChartData(data);
  }, [analytics.activeVisitors]);

  const maxVisitors = Math.max(...chartData.map(d => d.visitors));

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          Visitor Traffic (24h)
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Hourly visitor count
        </p>
      </div>
      
      <div className="p-6">
        <div className="flex items-end justify-between h-64 gap-1">
          {chartData.map((data, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
            >
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-blue-500 rounded-t transition-all duration-500 ease-out hover:from-green-400 hover:to-blue-400 cursor-pointer"
                  style={{ height: `${(data.visitors / maxVisitors) * 100}%` }}
                  title={`${data.label}: ${data.visitors} visitors`}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                    {data.visitors} visitors
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 rotate-45 origin-bottom-left">
                {data.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span>Peak: {maxVisitors} visitors</span>
          </div>
          <div className="text-gray-400">
            Current: {analytics.activeVisitors} active
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorChart;