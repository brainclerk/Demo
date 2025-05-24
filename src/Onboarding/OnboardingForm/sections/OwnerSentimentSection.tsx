import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormData } from '../types/form';
import { InputField } from '../fields/InputField';
import { CheckboxGroup } from '../fields/CheckboxGroup';
import { LikertScale } from '../fields/LikertScale';

const OwnerSentimentSection: React.FC = () => {
  const { 
    register, 
    formState: { errors },
    control
  } = useFormContext<FormData>();
  
  return (
    <div className="space-y-6">
      <InputField
        label="What is your top concern for your pet's health?"
        name="topConcern"
        register={register}
        rules={{ required: 'Please share your top concern' }}
        error={errors.topConcern}
        placeholder="Your biggest worry about your pet's health"
        isTextarea={true}
        rows={3}
      />
      
      <InputField
        label="What do you want to improve or prevent in your pet's health?"
        name="improvementGoals"
        register={register}
        rules={{ required: 'Please share what you want to improve' }}
        error={errors.improvementGoals}
        placeholder="What specific improvements are you hoping for?"
        isTextarea={true}
        rows={3}
      />
      
      <LikertScale
        label="How confident are you in your current pet care routine?"
        name="careConfidence"
        options={[
          { value: 1, label: 'Not at all confident' },
          { value: 2, label: 'Slightly confident' },
          { value: 3, label: 'Moderately confident' },
          { value: 4, label: 'Very confident' },
          { value: 5, label: 'Extremely confident' }
        ]}
        control={control}
      />
      
      <div className="space-y-2">
        <CheckboxGroup
          label="I'm interested in learning more about: (select all that apply)"
          name="interests"
          options={[
            { value: 'DNA Testing', label: 'DNA Testing' },
            { value: 'Supplements', label: 'Supplements' },
            { value: 'Diagnostics', label: 'Diagnostics' },
            { value: 'Health Coaching', label: 'Health Coaching' },
            { value: 'Telehealth', label: 'Telehealth' },
            { value: 'Biosensors', label: 'Biosensors/Monitoring' }
          ]}
          register={register}
          error={errors.interests as any}
        />
      </div>
    </div>
  );
};

export default OwnerSentimentSection;