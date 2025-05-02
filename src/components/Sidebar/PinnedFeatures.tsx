import React from 'react';
import { Star, ClipboardList } from 'lucide-react';
import { mockPinnedFeatures } from '../../data/mockData';

const PinnedFeatures: React.FC = () => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <Star className="w-5 h-5 text-purple-500 mr-2" />
        <span className="text-purple-500 font-medium">Pinned</span>
        <span className="text-gray-700 font-medium ml-1">Features</span>
      </div>
      
      <div className="space-y-3">
        {mockPinnedFeatures.map((feature) => (
          <a 
            key={feature.id}
            href={feature.path} 
            className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <ClipboardList className="w-5 h-5 text-gray-400 mr-3" />
            <span className="text-gray-600">{feature.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PinnedFeatures;