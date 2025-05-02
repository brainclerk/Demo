import React, { useState } from 'react';
import { Pet, Message, AgentType } from '../../types';
import { Sparkles } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import FeatureCards from './FeatureCards';
import { getChatCompletion } from '../../services/openai';
import { buildAgentPrompt } from './promptTemplates';

interface ChatInterfaceProps {
  pet: Pet;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ pet }) => {
  const [messagesByAgent, setMessagesByAgent] = useState<Record<AgentType, Message[]>>({
    general: [],
    nutrition: [],
    assessment: [],
    analysis: [],
    creative: []
  });
  const [inputValue, setInputValue] = useState('');
  const [currentAgent, setCurrentAgent] = useState<AgentType>('general');
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = async (actionId: string) => {
    let agentType: AgentType = 'general';
    
    switch (actionId) {
      case 'generate':
        agentType = 'general';
        break;
      case 'brainstorm':
        agentType = 'assessment';
        break;
      case 'analyze':
        agentType = 'analysis';
        break;
      case 'creative':
        agentType = 'creative';
        break;
      case 'more':
        agentType = 'nutrition';
        break;
    }
    
    setCurrentAgent(agentType);
    
    // Only initialize the agent if it doesn't have any messages
    if (messagesByAgent[agentType].length === 0) {
      setIsLoading(true);
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: buildAgentPrompt(agentType, pet, true),
        role: 'system',
        timestamp: new Date(),
        agentType
      };

      try {
        const response = await getChatCompletion({
          messages: [systemMessage],
        });

        if (!response) {
          throw new Error('No response received from the AI service');
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content || 'I am ready to help you with your questions.',
          role: 'assistant',
          timestamp: new Date(),
          agentType
        };
        
        setMessagesByAgent(prev => ({
          ...prev,
          [agentType]: [assistantMessage]
        }));
      } catch (error: any) {
        console.error('Error getting AI response:', error);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: error.message || 'Sorry, I encountered an error while processing your request.',
          role: 'assistant',
          timestamp: new Date(),
          agentType
        };
        setMessagesByAgent(prev => ({
          ...prev,
          [agentType]: [errorMessage]
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Create and add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
      agentType: currentAgent
    };
    
    setMessagesByAgent(prev => ({
      ...prev,
      [currentAgent]: [...prev[currentAgent], userMessage]
    }));
    setInputValue('');
    setIsLoading(true);
    
    try {
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: buildAgentPrompt(currentAgent, pet, false),
        role: 'system',
        timestamp: new Date(),
        agentType: currentAgent
      };

      const response = await getChatCompletion({
        messages: [
          systemMessage,
          ...messagesByAgent[currentAgent],
          userMessage
        ],
      });

      if (!response) {
        throw new Error('No response received from the AI service');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content || 'Sorry, I could not process your request.',
        role: 'assistant',
        timestamp: new Date(),
        agentType: currentAgent
      };
      
      setMessagesByAgent(prev => ({
        ...prev,
        [currentAgent]: [...prev[currentAgent], assistantMessage]
      }));
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error.message || 'Sorry, I encountered an error while processing your request.',
        role: 'assistant',
        timestamp: new Date(),
        agentType: currentAgent
      };
      setMessagesByAgent(prev => ({
        ...prev,
        [currentAgent]: [...prev[currentAgent], errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <ChatHeader pet={pet} />
      
      <ChatInput 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
      />
      
      <div className="h-4"></div>
      
      <div className="mb-6">
        <QuickActions onActionClick={handleActionClick} />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 max-h-[700px]">
        <ChatMessages messages={messagesByAgent[currentAgent]} isLoading={isLoading} />
        
        {messagesByAgent[currentAgent].length === 0 && (
          <div className="flex flex-col items-center justify-center h-48">
            <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-gray-500">Ask a question about {pet.name}'s health</p>
          </div>
        )}
      </div>
      
      <FeatureCards />
    </div>
  );
};

export default ChatInterface;