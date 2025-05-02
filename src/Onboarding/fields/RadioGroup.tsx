import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormData } from '../types/form';
import classNames from 'classnames';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

interface RadioGroupProps {
  name: keyof FormData;
  label: string;
  options: RadioOption[];
  register: UseFormRegister<FormData>;
  required?: boolean;
  error?: string;
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  register,
  required = false,
  error,
  selectedValue,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            className={classNames(
              "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50",
              {
                "border-blue-400 bg-blue-50": selectedValue === option.value,
                "border-slate-200": selectedValue !== option.value
              }
            )}
            onClick={() => onSelect?.(option.value)}
          >
            <input
              type="radio"
              className="sr-only"
              {...register(name, { required: required ? `${label} is required` : false })}
              value={option.value}
            />
            <div className="flex items-center space-x-3">
              {option.icon && (
                <option.icon 
                  className={classNames(
                    "w-5 h-5 transition-all duration-200",
                    {
                      'text-blue-400': selectedValue === option.value,
                      'text-slate-400': selectedValue !== option.value
                    }
                  )}
                />
              )}
              <span className="font-medium text-slate-800">{option.label}</span>
            </div>
            {option.description && (
              <p className="mt-1 text-xs text-slate-500">{option.description}</p>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-blue-500">{error}</p>}
    </div>
  );
}; 