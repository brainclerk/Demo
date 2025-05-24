import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';
import { InputField } from '../fields/InputField';
import { RadioGroup } from '../fields/RadioGroup';
import { ToggleField } from '../fields/ToggleField';
import { SliderField } from '../fields/SliderField';
import { activityLevelLabels } from '../constants/formLabels';

const LifestyleSection: React.FC = () => {
  const { 
    register, 
    formState: { errors }, 
    watch,
    control 
  } = useFormContext<FormData>();
  
  const usesTrackingDevice = watch('usesTrackingDevice');
  const aloneInDay = watch('aloneInDay');
  
  const activityLevelOptions = Object.entries(activityLevelLabels).map(([value, label]) => ({
    value,
    label
  }));
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <RadioGroup
          label="Daily Activity Level"
          name="activityLevel"
          options={activityLevelOptions}
          register={register}
          rules={{ required: 'Please select an activity level' }}
          error={errors.activityLevel}
        />
      </div>
      
      <SliderField
        label="Minutes of Activity per Day"
        name="activityMinutes"
        min={0}
        max={180}
        step={5}
        control={control}
      />
      
      <ToggleField
        label="Does your pet use a tracking device?"
        name="usesTrackingDevice"
        control={control}
      />
      
      {usesTrackingDevice && (
        <InputField
          label="What tracking device do you use?"
          name="trackingDeviceDetails"
          register={register}
          required={true}
          error={errors.trackingDeviceDetails}
          placeholder="Enter the brand/model of tracking device"
        />
      )}
      
      <ToggleField
        label="Is your pet alone during the day?"
        name="aloneInDay"
        control={control}
      />
      
      {aloneInDay && (
        <InputField
          label="How many hours is your pet alone on an average day?"
          name="hoursAlone"
          type="number"
          register={register}
          required={true}
          error={errors.hoursAlone}
          placeholder="Enter number of hours"
        />
      )}
    </div>
  );
};

export default LifestyleSection;