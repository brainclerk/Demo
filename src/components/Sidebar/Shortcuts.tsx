import React from 'react';
import { Sparkles, MoreHorizontal, PawPrint, Stethoscope, FlaskConical, Database } from 'lucide-react';
import { mockShortcuts } from '../../data/mockData';

const Shortcuts: React.FC = () => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-500 font-medium">Your</span>
          <span className="text-gray-700 font-medium ml-1">Shortcuts</span>
        </div>
        <button className="text-sm text-gray-600 font-medium">More</button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {mockShortcuts.map((shortcut) => (
          <a 
            key={shortcut.id}
            href={shortcut.path} 
            className={`${shortcut.color} p-4 rounded-md flex flex-col items-center justify-center text-center transition-transform hover:scale-105`}
          >
            {shortcut.icon === 'paw-print' && <PawPrint className="w-6 h-6 mb-1 text-gray-700" />}
            {shortcut.icon === 'stethoscope' && <Stethoscope className="w-6 h-6 mb-1 text-gray-700" />}
            {shortcut.icon === 'flask-conical' && <FlaskConical className="w-6 h-6 mb-1 text-gray-700" />}
            {shortcut.icon === 'database' && <Database className="w-6 h-6 mb-1 text-gray-700" />}
            <span className="text-xs font-medium text-gray-700">{shortcut.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;