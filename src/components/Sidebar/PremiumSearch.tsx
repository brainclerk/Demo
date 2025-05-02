import React from 'react';
import { Zap, Search } from 'lucide-react';

const PremiumSearch: React.FC = () => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center mb-2">
        <Zap className="w-5 h-5 text-blue-500 mr-2" />
        <span className="text-blue-500 font-medium">Premium</span>
        <span className="text-gray-700 font-medium ml-1">Search</span>
        <span className="text-gray-400 mx-1">/</span>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Quick search..."
          className="w-full bg-gray-100 py-2 pl-10 pr-4 rounded-md text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />
      </div>
    </div>
  );
};

export default PremiumSearch;