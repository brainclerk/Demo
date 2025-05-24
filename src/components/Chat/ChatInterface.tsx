import React, { useEffect, useState, useRef } from 'react';
import { Pet, Message, AgentType, User } from '../../types';
import { Sparkles } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import FeatureCards from './FeatureCards';
import { getChatCompletion } from '../../services/openai';
import { buildAgentPrompt } from './promptTemplates';
import { supabase } from '../../lib/supabase';

interface ChatInterfaceProps {
  pet: Pet;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ pet }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<AgentType, Message[]>>({
    general: [],
    nutrition: [],
    assessment: [],
    analysis: [],
    creative: []
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentAgent, setCurrentAgent] = useState<AgentType>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  useEffect(() => {
    const getUserId = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
      }
      setUserId(user.user?.id || null);
    }
    getUserId();
  }, [])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const loadChatSession = async () => {
      if (!selectedSessionId || !userId) return;
      setCurrentSessionId(selectedSessionId);
      setIsLoading(true);
      try {
        // Fetch messages for the selected session
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', selectedSessionId)
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        // Convert the messages to the correct format
        const formattedMessages: Message[] = messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.timestamp),
          agentType: msg.agent_type,
          images: msg.images || []
        }));

        // Get the agent type from the first message or default to 'general'
        const sessionAgentType = formattedMessages[0]?.agentType || 'general';
        setCurrentAgent(sessionAgentType);

        // Update the messages state for the specific agent
        setMessagesByAgent(prev => ({
          ...prev,
          [sessionAgentType]: formattedMessages
        }));

        // Set the current session ID
        setCurrentSessionId(currentSessionId);

        // Scroll to bottom after messages are loaded
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error loading chat session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatSession();
  }, [selectedSessionId, userId]);

  const createChatSession = async () => {
    if (!userId) return null;

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        pet_id: pet.id,
        title: 'New Chat'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      return null;
    }

    return session.id;
  };

  const saveMessageToDatabase = async (message: Message, sessionId: string) => {
    try {
      if (!userId) {
        console.error('User not authenticated');
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          content: message.content,
          role: message.role,
          agent_type: message.agentType,
          images: message.images || [],
          timestamp: message.timestamp
        });

      if (error) {
        console.error('Error saving message to database:', error);
        // If we get a permission error, we might need to refresh the session
        if (error.code === '42501') {
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError) {
            // Retry the insert after refreshing the session
            const { error: retryError } = await supabase
              .from('messages')
              .insert({
                session_id: sessionId,
                content: message.content,
                role: message.role,
                agent_type: message.agentType,
                images: message.images || [],
                timestamp: message.timestamp
              });
            if (retryError) {
              console.error('Error saving message after session refresh:', retryError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  };

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

      // Create a new chat session
      const sessionId = await createChatSession();
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
      setCurrentSessionId(sessionId);
      // Trigger history refresh after creating new session
      setHistoryRefreshTrigger(prev => prev + 1);

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

        // Save assistant message to database
        await saveMessageToDatabase(assistantMessage, sessionId);
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

        // Save error message to database
        await saveMessageToDatabase(errorMessage, sessionId);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateChatSessionTitle = async (messages: Message[], sessionId: string) => {
    if (!sessionId || messages.length < 1) return;

    try {
      // Create a prompt for OpenAI to generate a title
      const titlePrompt: Message = {
        id: Date.now().toString(),
        content: `Based on the conversation above, generate a very brief and concise title (maximum 6 words) that captures the main topic or purpose of this chat. Only respond with the title text, nothing else.`,
        role: 'user',
        timestamp: new Date(),
        agentType: currentAgent
      };

      const response = await getChatCompletion({
        messages: [...messages, titlePrompt],
      });

      if (!response || !response.content) {
        throw new Error('No title generated');
      }

      // Update the title in the database
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: response.content.trim() })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating chat session title:', error);
      } else {
        setHistoryRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error generating chat title:', error);
    }
  };

  const handleSendMessage = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    // Use selectedSessionId if available, otherwise use currentSessionId
    let sessionId = selectedSessionId || currentSessionId;
    
    // Only create a new session if we don't have any session ID
    if (!sessionId) {
      sessionId = await createChatSession();
      if (!sessionId) {
        return;
      }
      setCurrentSessionId(sessionId);
      // Trigger history refresh after creating new session
      setHistoryRefreshTrigger(prev => prev + 1);
    }

    let imageBase64s: string[] = [];
    if (files && files.length > 0) {
      try {
        // Filter for image files
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        // Process up to 5 images
        const imagesToProcess = imageFiles.slice(0, 5);

        // Process each image
        imageBase64s = await Promise.all(
          imagesToProcess.map(async (file) => {
            // Create a canvas to resize the image
            const img = await createImageBitmap(file);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions (max 400px width/height)
            const maxSize = 400;
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress the image
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to base64 with reduced quality
            return canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
          })
        );
      } catch (error) {
        console.error('Error processing images:', error);
      }
    }

    // Create and add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
      agentType: currentAgent,
      images: imageBase64s,
      hasMoreFiles: files ? files.length > 5 : false
    };

    setMessagesByAgent(prev => ({
      ...prev,
      [currentAgent]: [...prev[currentAgent], userMessage]
    }));

    // Scroll to bottom after user message
    setTimeout(scrollToBottom, 100);

    // Save user message to database
    if (sessionId) {
      await saveMessageToDatabase(userMessage, sessionId);
    }

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

      // No longer saving system message to database

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

      // Scroll to bottom after assistant message
      setTimeout(scrollToBottom, 100);

      // Save assistant message to database
      if (sessionId) {
        await saveMessageToDatabase(assistantMessage, sessionId);
        // Update chat session title after getting the response
        await updateChatSessionTitle([...messagesByAgent[currentAgent], userMessage, assistantMessage], sessionId);
      }
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

      // Scroll to bottom after error message
      setTimeout(scrollToBottom, 100);

      // Save error message to database
      if (sessionId) {
        await saveMessageToDatabase(errorMessage, sessionId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setMessagesByAgent(prev => ({
      ...prev,
      [currentAgent]: []
    }));
    setCurrentSessionId(null);
  };

  const handleSessionSelect = (sessionId: string) => {
    setMessagesByAgent({
      general: [],
      nutrition: [],
      assessment: [],
      analysis: [],
      creative: []
    });
    setSelectedSessionId(sessionId);
  };

  return (
    <div className="max-w-5xl mx-auto my-10">
      <ChatHeader pet={pet} />

      <ChatInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
        onRefresh={handleRefresh}
        petName={pet.pet_name}
      />

      <div className="h-4"></div>

      <div className="mb-6">
        <QuickActions onActionClick={handleActionClick} />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 max-h-[700px]" ref={messagesContainerRef}>
        <ChatMessages messages={messagesByAgent[currentAgent]} agentType={currentAgent} isLoading={isLoading} />

        {messagesByAgent[currentAgent].length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-48">
            <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-gray-500">Ask a question about {pet.pet_name}'s health</p>
          </div>
        )}
      </div>

      <FeatureCards onSessionSelect={handleSessionSelect} historyRefreshTrigger={historyRefreshTrigger} />
    </div>
  );
};

export default ChatInterface;