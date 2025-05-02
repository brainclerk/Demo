import React from 'react';
import { Zap, MessageSquare, ClipboardList, Lightbulb, Bone } from 'lucide-react';
import { mockQuickActions } from '../../data/mockData';

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      <button 
        className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md transition-transform hover:scale-105"
        onClick={() => onActionClick('generate')}
      >
        <Zap className="w-5 h-5" />
        <span>Generate</span>
      </button>
      
      <button 
        className="flex items-center justify-center gap-2 bg-amber-400 text-white px-4 py-2 rounded-md transition-transform hover:scale-105"
        onClick={() => onActionClick('brainstorm')}
      >
        <MessageSquare className="w-5 h-5" />
        <span>Assess</span>
      </button>
      
      <button 
        className="flex items-center justify-center gap-2 bg-red-400 text-white px-4 py-2 rounded-md transition-transform hover:scale-105"
        onClick={() => onActionClick('analyze')}
      >
        <ClipboardList className="w-5 h-5" />
        <span>Analyze</span>
      </button>
      
      <button 
        className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md transition-transform hover:scale-105"
        onClick={() => onActionClick('creative')}
      >
        <Lightbulb className="w-5 h-5" />
        <span>Creative</span>
      </button>
      
      <button 
        className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md transition-transform hover:scale-105"
        onClick={() => onActionClick('more')}
      >
        <Bone className="w-5 h-5" />
        <span>Nutrition</span>
      </button>
    </div>
  );
};

export default QuickActions;