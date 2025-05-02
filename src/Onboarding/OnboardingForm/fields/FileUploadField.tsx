import React, { useState } from 'react';
import { FieldError, Control, Controller } from 'react-hook-form';
import { FormData } from '../types/form';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploadFieldProps {
  label: string;
  name: keyof FormData;
  accept?: string;
  control: Control<FormData>;
  error?: FieldError;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  accept,
  control,
  error
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  
  return (
    <div className="space-y-2">
      <label htmlFor={name as string} className="label">
        {label}
      </label>
      
      <Controller
        name={name as any} // Type assertion needed for file input
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <>
            <div className="relative">
              {!fileName ? (
                <label
                  htmlFor={name as string}
                  className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-50 transition duration-150"
                >
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Click to upload or drag and drop</span>
                  <span className="text-xs text-slate-400 mt-1">
                    {accept ? `Accepted formats: ${accept.replace(/\./g, '').toUpperCase()}` : 'All file types accepted'}
                  </span>
                </label>
              ) : (
                <div className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-sm text-slate-700 truncate max-w-[200px]">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(null);
                      setFileName(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 transition duration-150"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input
                id={name as string}
                type="file"
                accept={accept}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onChange(file);
                  setFileName(file?.name || null);
                }}
                className="sr-only"
                {...field}
              />
            </div>
          </>
        )}
      />
      
      {error && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
};