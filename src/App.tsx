import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Onboarding from './Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import { authService } from './services/auth.service';

const AppContent: React.FC = () => {
  const { user, isLoading, logout, updateUser } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const handleOnboardingComplete = async () => {
    if (user) {
      try {
        await authService.updateOnboardingStatus(user.id, true);
        updateUser({ onboardingCompleted: true });
      } catch (error) {
        console.error('Error updating onboarding status:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Signup
        onRegisterSuccess={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLoginSuccess={() => {}}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  if (!user.onboardingCompleted) {
    return <Onboarding user={user} onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PetProvider>
        <AppContent />
      </PetProvider>
    </AuthProvider>
  );
};

export default App;