import React from 'react';
import { User } from '../../types';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="p-6">
      <div className="flex items-center">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="ml-4">
          <div className="flex items-center mb-1">
            <span className="inline-block bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-md mr-2">
              Premium
            </span>
            <span className="text-gray-500 text-xs">Monthly Plan</span>
          </div>
          <h2 className="font-semibold text-xl">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;