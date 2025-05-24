import React, { useEffect, useState } from 'react';
import { VetHistoryItem } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { CalendarClock, PawPrint, MessageSquare, Bone, ClipboardList, Lightbulb, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { usePet } from '../../contexts/PetContext';

interface VetHistoryProps {
  onSessionSelect?: (sessionId: string) => void;
  historyRefreshTrigger: number;
}

const VetHistory: React.FC<VetHistoryProps> = ({ onSessionSelect, historyRefreshTrigger }) => {
  const [historyItems, setHistoryItems] = useState<VetHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  const { currentPet } = usePet();

  const fetchChatHistory = async (fetchAll: boolean = false) => {
    if (!user || !currentPet) return;

    try {
      setIsLoading(true);
      let query = supabase
        .from('chat_sessions')
        .select(`
          id, 
          created_at, 
          title,
          messages!inner (
            content,
            agent_type,
            timestamp
          )
        `)
        .eq('user_id', user.id)
        .eq('pet_id', currentPet.id)
        .order('created_at', { ascending: false });

      // Only apply limit if not fetching all
      if (!fetchAll) {
        query = query.limit(5);
      }

      const { data: sessions, error } = await query;

      if (error) {
        console.error('Error fetching chat history:', error);
        return;
      }

      const history: VetHistoryItem[] = sessions.map(session => {
        // Get the first message by timestamp
        const firstMessage = session.messages.sort((a: any, b: any) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )[0];

        return {
          id: session.id,
          type: firstMessage?.agent_type || 'general',
          title: session.title || 'Chat Session',
          timestamp: new Date(session.created_at)
        };
      });

      setHistoryItems(history);
    } catch (error) {
      console.error('Error processing chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory(showAll);
  }, [user, currentPet, showAll, historyRefreshTrigger]);

  const handleViewAll = () => {
    setShowAll(true);
  };

  const handleSessionClick = (sessionId: string) => {
    if (onSessionSelect) {  
      onSessionSelect(sessionId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'allergies':
        return <PawPrint className="w-4 h-4 text-blue-500" />;
      case 'appointment':
        return <CalendarClock className="w-4 h-4 text-blue-500" />;
      case 'nutrition':
        return <Bone className="w-4 h-4 text-green-500" />;
      case 'assessment':
        return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case 'analysis':
        return <ClipboardList className="w-4 h-4 text-red-400" />;
      case 'creative':
        return <Lightbulb className="w-4 h-4 text-purple-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h3 className="text-xl font-semibold">Vet AI History</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <h3 className="text-xl font-semibold">Vet AI History</h3>
        <button
          onClick={handleViewAll}
          disabled={showAll}
          className={`text-sm bg-white rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50 border border-gray-100 ${showAll ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          View all
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {historyItems.length > 0 ? (
            historyItems.map((item) => (
              <div 
                key={item.id} 
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" 
                onClick={() => handleSessionClick(item.id)}
              >
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
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No chat history yet
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex justify-center">
          <span className="text-blue-500 font-medium">
            {showAll ? 'End of history' : `Showing ${Math.min(5, historyItems.length)} of ${historyItems.length} items`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VetHistory;