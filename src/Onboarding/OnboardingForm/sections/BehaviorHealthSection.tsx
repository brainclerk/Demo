import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';
import { InputField } from '../fields/InputField';
import { SelectField } from '../fields/SelectField';
import { CheckboxGroup } from '../fields/CheckboxGroup';
import { temperamentLabels } from '../constants/formLabels';

const BehaviorHealthSection: React.FC = () => {
  const { 
    register, 
    formState: { errors }
  } = useFormContext<FormData>();
  
  const temperamentOptions = [
    { value: '', label: 'Select temperament...' },
    ...Object.entries(temperamentLabels).map(([value, label]) => ({
      value,
      label
    }))
  ];
  
  return (
    <div className="space-y-6">
      <SelectField
        label="General Temperament"
        name="temperament"
        register={register}
        rules={{ required: 'Please select a temperament' }}
        error={errors.temperament}
        options={temperamentOptions}
      />
      
      <div className="space-y-2">
        <CheckboxGroup
          label="Recent Behaviors (select all that apply)"
          name="recentBehaviors"
          options={[
            { value: 'Excessive Licking', label: 'Excessive Licking' },
            { value: 'Limping', label: 'Limping' },
            { value: 'Appetite Change', label: 'Appetite Change' },
            { value: 'Sleep Change', label: 'Sleep Change' },
            { value: 'Excessive Panting', label: 'Excessive Panting' },
            { value: 'Withdrawn', label: 'Withdrawn' },
            { value: 'Increased Thirst', label: 'Increased Thirst' },
            { value: 'Excessive Barking', label: 'Excessive Barking' }
          ]}
          register={register}
          error={errors.recentBehaviors as any}
        />
      </div>
      
      <div className="space-y-2">
        <CheckboxGroup
          label="Current Symptoms (select all that apply)"
          name="currentSymptoms"
          options={[
            { value: 'Digestive Issues', label: 'Digestive Issues' },
            { value: 'Skin Problems', label: 'Skin Problems' },
            { value: 'Coughing', label: 'Coughing' },
            { value: 'Seizures', label: 'Seizures' },
            { value: 'Joint Pain', label: 'Joint Pain' },
            { value: 'Eye Discharge', label: 'Eye Discharge' },
            { value: 'Ear Infection', label: 'Ear Infection' },
            { value: 'Bad Breath', label: 'Bad Breath' }
          ]}
          register={register}
          error={errors.currentSymptoms as any}
        />
      </div>
      
      <InputField
        label="Any major health events recently?"
        name="majorHealthEvents"
        register={register}
        placeholder="Describe any significant health events in the past 6 months"
        isTextarea={true}
        rows={3}
      />
    </div>
  );
};

export default BehaviorHealthSection;