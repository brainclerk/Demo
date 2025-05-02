import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormData } from '../types/form';

interface SliderFieldProps {
  label: string;
  name: keyof FormData;
  min: number;
  max: number;
  step: number;
  control: Control<FormData>;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  label,
  name,
  min,
  max,
  step,
  control
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={name as string} className="label">
          {label}
        </label>
      </div>
      
      <Controller
        name={name as any}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="relative pt-5 pb-5">
            {showTooltip && (
              <div 
                className="absolute -top-1 left-0 px-2 py-1 rounded bg-blue-300 text-white text-xs transform -translate-y-full"
                style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 1rem)` }}
              >
                {value} minutes
              </div>
            )}
            <input
              id={name as string}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onTouchStart={() => setShowTooltip(true)}
              onTouchEnd={() => setShowTooltip(false)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-300"
              style={{
                background: `linear-gradient(to right, #93C5FD 0%, #93C5FD ${((value - min) / (max - min)) * 100}%, #E2E8F0 ${((value - min) / (max - min)) * 100}%, #E2E8F0 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>{min} min</span>
              <span>{max} min</span>
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-sm font-medium text-blue-400">{value} minutes per day</span>
            </div>
          </div>
        )}
      />
    </div>
  );
};