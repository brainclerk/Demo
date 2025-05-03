import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { FormData } from '../types/form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: keyof FormData;
  options: SelectOption[];
  register: UseFormRegister<FormData>;
  rules?: Record<string, unknown>;
  error?: FieldError;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  register,
  rules,
  error
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name as string} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      
      <select
        id={name as string}
        {...register(name, rules)}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-blue-500' : 'border-slate-300'}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-blue-600">{error.message}</p>
      )}
    </div>
  );
};