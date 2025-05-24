import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatInterface from '../Chat/ChatInterface';
import { usePet } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

const Dashboard: React.FC = () => {
  const { currentPet, isLoading, error } = usePet();
  const { user } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!currentPet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No pets found. Please add a pet to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar user={user as User} pet={currentPet} />
      <main className="flex-1 h-screen overflow-y-auto">
        <ChatInterface pet={currentPet} />
      </main>
    </div>
  );
};

export default Dashboard;