import React from 'react';
import { User } from '../../types';
import {
  Infinity, Zap, Search, Sparkles, PawPrint, Stethoscope,
  FlaskConical, Database, Star
} from 'lucide-react';
import UserProfile from './UserProfile';
import PremiumSearch from './PremiumSearch';
import Shortcuts from './Shortcuts';
import VirtualVet from './VirtualVet';
import PinnedFeatures from './PinnedFeatures';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <aside className="w-[380px] border-r border-gray-200 bg-white hidden md:flex flex-col h-screen overflow-y-auto">
      <UserProfile user={user} />

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Infinity className="w-6 h-6 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="font-medium">{user.credits}</p>
            <button className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
              Manage Account
            </button>
          </div>
        </div>
      </div>

      <PremiumSearch />
      <Shortcuts />
      <VirtualVet />
      <PinnedFeatures />
    </aside>
  );
};

export default Sidebar;