import React from 'react';
import { FieldError, Control, Controller } from 'react-hook-form';
import { FormData, VetRecord } from '../types/form';
import { Upload, X, FileText, ExternalLink } from 'lucide-react';

interface FileUploadFieldProps {
  label: string;
  name: keyof FormData;
  accept?: string;
  control: Control<FormData>;
  error?: FieldError;
}

const isFile = (record: File | VetRecord): record is File => {
  return record instanceof File;
};

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  accept,
  control,
  error
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name as string} className="label">
        {label}
      </label>
      
      <Controller
        name={name as any}
        control={control}
        defaultValue={null}
        render={({ field: { onChange, value, ...field } }) => (
          <>
            <div className="relative">
              {!value || (Array.isArray(value) && value.length === 0) ? (
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
                <div className="space-y-2">
                  {(Array.isArray(value) ? value : [value]).map((record, index) => (
                    <div key={index} className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-teal-500 mr-2" />
                        <span className="text-sm text-slate-700 truncate max-w-[200px]">
                          {isFile(record) ? record.name : record.filename}
                        </span>
                        {!isFile(record) && record.url && (
                          <a
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-slate-400 hover:text-slate-600 transition duration-150"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (Array.isArray(value)) {
                            const newRecords = [...value];
                            newRecords.splice(index, 1);
                            onChange(newRecords.length === 0 ? null : newRecords);
                          } else {
                            onChange(null);
                          }
                        }}
                        className="text-slate-400 hover:text-slate-600 transition duration-150"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor={name as string}
                    className="w-full flex items-center justify-center px-4 py-2 bg-white rounded-lg border border-slate-300 cursor-pointer hover:bg-slate-50 transition duration-150"
                  >
                    <Upload className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-500">Add more files</span>
                  </label>
                </div>
              )}
              <input
                id={name as string}
                type="file"
                accept={accept}
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    const currentRecords = Array.isArray(value) ? value : (value ? [value] : []);
                    onChange([...currentRecords, ...files]);
                  }
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