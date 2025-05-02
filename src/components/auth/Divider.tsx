import React from 'react';

interface DividerProps {
  text: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <div className="relative my-6 flex items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 flex-shrink text-sm text-gray-500">{text}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default Divider;