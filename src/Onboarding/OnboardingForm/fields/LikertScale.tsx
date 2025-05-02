import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormData } from '../types/form';
import classNames from 'classnames';

interface LikertOption {
  value: number;
  label: string;
}

interface LikertScaleProps {
  label: string;
  name: keyof FormData;
  options: LikertOption[];
  control: Control<FormData>;
}

export const LikertScale: React.FC<LikertScaleProps> = ({
  label,
  name,
  options,
  control
}) => {
  return (
    <div className="space-y-4">
      <label className="label">
        {label}
      </label>
      
      <Controller
        name={name as any}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="grid grid-cols-5 gap-1">
            {options.map((option) => (
              <div key={option.value} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={classNames(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300",
                    {
                      "bg-blue-300 text-white": value === option.value,
                      "bg-white border border-slate-300 text-slate-700 hover:bg-blue-50": value !== option.value,
                    }
                  )}
                >
                  {option.value}
                </button>
                <span className="text-xs text-center text-slate-600 px-1">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};