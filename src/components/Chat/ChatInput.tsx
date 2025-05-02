import React, { KeyboardEvent } from 'react';
import { Upload, RefreshCw } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  return (
    <div className="relative bg-white rounded-md shadow-sm border border-gray-200 p-2">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 px-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Upload className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything related to your dog!"
          className="flex-1 py-2 px-3 text-gray-700 focus:outline-none bg-transparent"
          autoFocus
        />
        
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Use Voice Mode</span>
          <button 
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => value.trim() && onSend(value)}
          >
            <img src="/voice-waves.svg" alt="Voice Mode" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;