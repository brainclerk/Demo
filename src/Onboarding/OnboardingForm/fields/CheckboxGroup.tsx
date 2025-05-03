import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { FormData } from '../types/form';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  name: keyof FormData;
  options: CheckboxOption[];
  register: UseFormRegister<FormData>;
  rules?: Record<string, unknown>;
  error?: FieldError;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  register,
  rules,
  error
}) => {
  return (
    <div className="space-y-2">
      <label className="label">
        {label}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              value={option.value}
              {...register(name as any, rules)} // Type assertion needed for checkbox arrays
              className="checkbox-input"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="checkbox-label ml-2"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="error-message">{error.message}</p>
      )}
    </div>
  );
};