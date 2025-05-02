import React from 'react';

const VirtualVet: React.FC = () => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="bg-white rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">TeleVet Consultation</h3>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center mr-3">
          </span>
          <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualVet;