import React, { ReactElement } from 'react';
import { UseFormRegister, FieldError, Controller, useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';

interface InputFieldProps {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<FormData>;
  required?: boolean;
  rules?: Record<string, unknown>;
  error?: string | FieldError;
  isTextarea?: boolean;
  rows?: number;
  render?: (props: {
    onChange: (value: any) => void;
    value: any;
    [key: string]: any;
  }) => ReactElement;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  required = false,
  rules,
  error,
  isTextarea = false,
  rows = 3,
  render
}) => {
  const { control } = useFormContext<FormData>();
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const validationRules = rules || { required: required ? `${label} is required` : false };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {render ? (
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field }) => render({
            ...field,
            onChange: (value: any) => field.onChange(value)
          })}
        />
      ) : isTextarea ? (
        <textarea
          id={name}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-blue-500' : 'border-slate-300'}
          `}
          rows={rows}
          placeholder={placeholder}
          {...register(name, validationRules)}
        />
      ) : (
        <input
          id={name}
          type={type}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-blue-500' : 'border-slate-300'}
          `}
          placeholder={placeholder}
          {...register(name, validationRules)}
        />
      )}
      {errorMessage && (
        <p className="mt-1 text-sm text-blue-600">{errorMessage}</p>
      )}
    </div>
  );
}; 