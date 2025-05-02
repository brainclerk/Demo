import React from 'react';
import AppLayout from '../components/Layout/AppLayout';
import OnboardingForm from './OnboardingForm/OnboardingForm';
import { User } from '../types';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Health Profile for {user.name}</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Let's create a comprehensive health profile for your pet. This takes &lt; 7 minutes and this information helps us provide personalized care recommendations.
          </p>
        </div>
        
        <OnboardingForm onComplete={onComplete} />
      </div>
    </AppLayout>
  );
};

export default Onboarding;
