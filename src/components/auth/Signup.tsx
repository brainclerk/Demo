import React from 'react';
import SignupForm from './SignupForm';

interface SignupProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <SignupForm onRegisterSuccess={onRegisterSuccess} onSwitchToLogin={onSwitchToLogin} />
      </div>
    </div>
  );
};

export default Signup;