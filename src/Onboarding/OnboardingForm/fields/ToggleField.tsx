import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormData } from '../types/form';
import classNames from 'classnames';

interface ToggleFieldProps {
  label: string;
  name: keyof FormData;
  control: Control<FormData>;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  name,
  control
}) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      
      <Controller
        name={name as any}
        control={control}
        render={({ field: { value, onChange } }) => (
          <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className={classNames(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400",
              {
                "bg-blue-400": value,
                "bg-slate-200": !value
              }
            )}
          >
            <span
              className={classNames(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                {
                  "translate-x-6": value,
                  "translate-x-1": !value
                }
              )}
            />
          </button>
        )}
      />
    </div>
  );
};