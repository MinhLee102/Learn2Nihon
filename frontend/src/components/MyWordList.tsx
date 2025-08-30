import React from 'react';

const MyWordList: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 h-full min-h-[400px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">My word list</h3>
      <p className="text-gray-500">No words added yet.</p>
    </div>
  );
};

export default MyWordList;