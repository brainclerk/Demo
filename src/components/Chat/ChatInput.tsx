import React, { KeyboardEvent, useState, useRef } from 'react';
import { Upload, RefreshCw, X, File } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (message: string, files?: File[]) => void;
  onRefresh: () => void;
}

interface FileWithPreview {
  file: File;
  previewUrl: string;
  isImage: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onRefresh }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            placeholder="Ask me anything related to your dog!"
            className="flex-1 py-2 px-3 text-gray-700 focus:outline-none bg-transparent"
            autoFocus
          />
          
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Use Voice Mode</span>
            <button 
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={handleSend}
            >
              <img src="/voice-waves.svg" alt="Voice Mode" className="w-5 h-5" />
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