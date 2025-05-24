import React from 'react';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center">
        {
          user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center">
              <p className="text-green-500 text-2xl font-bold">{user.name.toUpperCase().charAt(0) || user.email.toUpperCase().charAt(0)}</p>
            </div>
          )
        }
        <div className="ml-4 flex-grow">
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
      <button
        onClick={handleLogout}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;