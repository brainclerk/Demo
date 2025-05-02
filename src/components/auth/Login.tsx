import React from 'react';
import LoginForm from './LoginForm';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <LoginForm onLoginSuccess={onLoginSuccess} onSwitchToRegister={onSwitchToRegister} />
      </div>
    </div>
  );
};

export default Login;