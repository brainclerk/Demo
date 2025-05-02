import React from 'react';
import { VetHistoryItem } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { CalendarClock, PawPrint, MessageSquare } from 'lucide-react';

interface VetHistoryProps {
  historyItems: VetHistoryItem[];
}

const VetHistory: React.FC<VetHistoryProps> = ({ historyItems }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'allergies':
        return <PawPrint className="w-4 h-4 text-blue-500" />;
      case 'appointment':
        return <CalendarClock className="w-4 h-4 text-blue-500" />;
      case 'question':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <h3 className="text-xl font-semibold">Vet AI History</h3>
        <button className="text-sm bg-white rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50 border border-gray-100">
          View all
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {historyItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="mr-3">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                </div>
                <div className="text-gray-400 text-sm">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex justify-center">
          <span className="text-blue-500 font-medium">
            {historyItems.length > 5 ? 'Load more' : 'End of history'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VetHistory;