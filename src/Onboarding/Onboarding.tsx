import React from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import OnboardingForm from './OnboardingForm/OnboardingForm';
import { User } from '../types';
import { FormData } from './OnboardingForm/types/form';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
  petId?: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete, petId }) => {
  const location = useLocation();
  const initialData = location.state?.initialData as Partial<FormData> | undefined;
  const statePetId = location.state?.petId as string | undefined;
  const isEditMode = !!initialData;

  console.log("initialData", initialData);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {isEditMode ? 'Edit Pet Profile' : 'Health Profile'}
          </h1>
          {!isEditMode && (
            <p className="text-slate-500 max-w-2xl mx-auto">
              Let's create a comprehensive health profile for your pet. This takes &lt; 7 minutes and this information helps us provide personalized care recommendations.
            </p>
          )}
        </div>
        
        <OnboardingForm 
          onComplete={onComplete}
          initialData={initialData}
          petId={statePetId}
        />
      </div>
    </AppLayout>
  );
};

export default Onboarding;
