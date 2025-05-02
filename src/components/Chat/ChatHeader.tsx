import React from 'react';
import { Pet } from '../../types';
import { Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  pet: Pet;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ pet }) => {
  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold flex items-center justify-center">
          How can I help {pet.name}?
          <Sparkles className="w-5 h-5 text-purple-500 ml-2" />
        </h1>
      </div>
    </div>
  );
};

export default ChatHeader;