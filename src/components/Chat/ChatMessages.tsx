import React from 'react';
import { Message } from '../../types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { File } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  if (messages.length === 0 && !isLoading) return null;

  return (
    <div className="space-y-4 mb-6">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[90%] rounded-lg p-3 ${
              message.role === 'user' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
          >
            {message.images && message.images.length > 0 && (
              <div className="mb-3 -mx-3 -mt-3">
                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-t-lg">
                  {message.images.map((image, index) => (
                    <div key={index} className="relative aspect-square max-w-[150px]">
                      <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt={`Uploaded content ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                  {message.hasMoreFiles && (
                    <div className="relative aspect-square max-w-[150px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <File className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">More files</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className={message.images && message.images.length > 0 ? 'mt-3' : ''}>
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:mb-2 prose-p:mb-2 prose-ul:pl-4 prose-ul:mb-2 prose-ol:pl-4 prose-ol:mb-2 prose-li:mb-1 prose-strong:font-semibold">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {format(message.timestamp, 'h:mm a')}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;