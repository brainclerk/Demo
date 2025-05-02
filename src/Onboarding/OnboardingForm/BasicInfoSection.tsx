import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../../types/form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputField } from '../fields/InputField';
import { RadioGroup } from './fields/RadioGroup';
import { Dog, Scale as Male, Scale as Female, Search, Calendar } from 'lucide-react';
import classNames from 'classnames';

interface SexOption {
  value: FormData['sex'];
  label: string;
  icon: React.ElementType;
}

interface SizeOption {
  value: FormData['sizeCategory'];
  label: string;
  description: string;
}

const sexOptions: SexOption[] = [
  { value: 'male', label: 'Male', icon: Male },
  { value: 'female', label: 'Female', icon: Female },
];

const sizeOptions: SizeOption[] = [
  { value: 'small', label: 'Small', description: 'Under 20 lbs' },
  { value: 'medium', label: 'Medium', description: '20-50 lbs' },
  { value: 'large', label: 'Large', description: '50-100 lbs' },
  { value: 'giant', label: 'Giant', description: 'Over 100 lbs' },
];

export const BasicInfoSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <RadioGroup
        name="sex"
        label="Pet's Sex"
        options={sexOptions}
        register={register}
        rules={{ required: 'Please select a sex' }}
        error={errors.sex}
      />

      <RadioGroup
        name="sizeCategory"
        label="Size Category"
        options={sizeOptions}
        register={register}
        rules={{ required: 'Please select a size category' }}
        error={errors.sizeCategory}
      />
    </div>
  );
};