import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleOnboardingComplete = async () => {
    console.log('Onboarding complete');
    if (user) {
      try {
        // Only update onboarding status if it's a new profile (not an edit)
        if (!user.onboardingCompleted) {
          await authService.updateOnboardingStatus(user.id, true);
          updateUser({ onboardingCompleted: true });
        }
        // Navigate to dashboard after completion
        navigate('/');
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

  return (
    <Routes>
      <Route 
        path="/onboarding" 
        element={<Onboarding user={user} onComplete={handleOnboardingComplete} />}
      />
      <Route 
        path="/" 
        element={
          !user.onboardingCompleted ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Dashboard />
          )
        } 
      />
    </Routes>
  );
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