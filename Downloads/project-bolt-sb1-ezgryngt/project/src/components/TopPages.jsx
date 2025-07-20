import React from 'react';
import { FileText, TrendingUp } from 'lucide-react';

const TopPages = ({ pages }) => {
  const maxViews = Math.max(...pages.map(page => page.views));

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          Top Pages
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Most visited pages today
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {pages.map((page, index) => (
            <div key={page.path} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-300">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-mono text-white bg-gray-700 px-2 py-1 rounded">
                    {page.path}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {page.views.toLocaleString()}
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(page.views / maxViews) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 min-w-[3rem] text-right">
                  {page.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {pages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No page data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPages;