import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { FormData } from '../types/form';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: keyof FormData;
  options: RadioOption[];
  register: UseFormRegister<FormData>;
  rules?: Record<string, unknown>;
  error?: FieldError;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
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
      
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value}>
            <input
              type="radio"
              id={`${name}-${option.value}`}
              value={option.value}
              {...register(name, rules)}
              className="radio-input"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="radio-label"
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