import React from 'react';

const SuggestionBanner: React.FC = () => {
  return (
    <div className="mb-6 w-full">
      <div className="bg-purple-50 rounded-md p-4 flex items-center justify-between">
        <p className="text-purple-700">No idea? I have some suggestions for you</p>
        <button className="text-purple-500 font-medium hover:text-purple-700 transition-colors">
          Click here
        </button>
      </div>
    </div>
  );
};

export default SuggestionBanner;