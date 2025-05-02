import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatInterface from '../Chat/ChatInterface';
import { usePet } from '../../contexts/PetContext';
import { mockUser } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const { currentPet, isLoading, error } = usePet();

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={mockUser} />
      <main className="flex-1 p-4 md:p-6">
        <ChatInterface pet={currentPet} />
      </main>
    </div>
  );
};

export default Dashboard;