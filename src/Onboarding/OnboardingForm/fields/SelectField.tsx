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
    <div className="space-y-2">
      <label htmlFor={name as string} className="label">
        {label}
      </label>
      
      <select
        id={name as string}
        {...register(name, rules)}
        className="select-field"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
};