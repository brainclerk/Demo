import React, { KeyboardEvent, useState, useRef, useEffect } from 'react';
import { Upload, RefreshCw, X, File, Mic, MicOff } from 'lucide-react';

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (message: string, files?: File[]) => void;
  onRefresh: () => void;
  petName: string;
}

interface FileWithPreview {
  file: File;
  previewUrl: string;
  isImage: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onRefresh, petName }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        let transcript = '';

        for (let i = 0; i < results.length; i++) {
          if (results[i].isFinal) {
            transcript += results[i][0].transcript;
          }
        }

        if (transcript) {
          onChange({ 
            target: { 
              value: transcript 
            } 
          } as React.ChangeEvent<HTMLInputElement>);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (isVoiceMode && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onChange, isVoiceMode]);

  const toggleVoiceMode = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      finalTranscriptRef.current = '';
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    try {
      const processedFiles = await Promise.all(
        validFiles.map(async (file) => {
          const isImage = file.type.startsWith('image/');
          let previewUrl = '';
          
          if (isImage) {
            previewUrl = URL.createObjectURL(file);
          }

          return {
            file,
            previewUrl,
            isImage
          };
        })
      );

      setSelectedFiles(prev => [...prev, ...processedFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].previewUrl) {
        URL.revokeObjectURL(newFiles[index].previewUrl);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSend = () => {
    if (value.trim() || selectedFiles.length > 0) {
      onSend(value, selectedFiles.map(f => f.file));
      // Cleanup
      selectedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative bg-white rounded-md shadow-sm border border-gray-200 p-2">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 px-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <button 
              onClick={handleUploadClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onRefresh}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={`Ask me anything about ${petName}!`}
            className="flex-1 py-2 px-3 text-gray-700 focus:outline-none bg-transparent"
            autoFocus
          />
          
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Voice Mode</span>
            <button 
              className={`p-2 rounded-lg transition-colors ${
                isVoiceMode 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
              onClick={toggleVoiceMode}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative inline-block">
                {file.isImage ? (
                  <img 
                    src={file.previewUrl} 
                    alt={`Preview ${index + 1}`} 
                    className="max-h-32 rounded-md"
                  />
                ) : (
                  <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                    <File className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      {file.file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;