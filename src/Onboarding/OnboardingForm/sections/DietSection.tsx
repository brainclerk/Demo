import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';
import { InputField } from '../fields/InputField';
import { CheckboxGroup } from '../fields/CheckboxGroup';
import { ToggleField } from '../fields/ToggleField';

const DietSection: React.FC = () => {
  const { 
    register, 
    control,
    formState: { errors }, 
    watch 
  } = useFormContext<FormData>();
  
  const dietTypes = watch('dietTypes') || [];
  const hasOtherDietType = dietTypes.includes('Other');
  const takesSupplements = watch('takesSupplements');
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CheckboxGroup
          label="Current Diet Type"
          name="dietTypes"
          options={[
            { value: 'Kibble', label: 'Kibble' },
            { value: 'Wet', label: 'Wet' },
            { value: 'Raw', label: 'Raw' },
            { value: 'Home-cooked', label: 'Home-cooked' },
            { value: 'Prescription', label: 'Prescription' },
            { value: 'Other', label: 'Other' }
          ]}
          register={register}
          rules={{ required: 'Please select at least one diet type' }}
        />
      </div>
      
      {hasOtherDietType && (
        <InputField
          label="Please specify other diet type"
          name="otherDietType"
          register={register}
          required={true}
          error={errors.otherDietType}
          placeholder="Enter other diet type"
        />
      )}
      
      <InputField
        label="Main Brand(s) Used"
        name="mainBrands"
        register={register}
        placeholder="Enter the main food brands you use"
      />
      
      <ToggleField
        label="Do you give your pet daily supplements?"
        name="takesSupplements"
        control={control}
      />
      
      {takesSupplements && (
        <InputField
          label="What supplements do you give your pet?"
          name="supplementDetails"
          register={register}
          required={true}
          error={errors.supplementDetails}
          placeholder="List supplements and how often you give them"
          isTextarea={true}
          rows={3}
        />
      )}
      
      <InputField
        label="Food Allergies or Sensitivities"
        name="foodAllergies"
        register={register}
        placeholder="List any known food allergies or sensitivities"
        isTextarea={true}
        rows={3}
      />
    </div>
  );
};

export default DietSection;