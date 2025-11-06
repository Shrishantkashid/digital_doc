
import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-10">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 font-semibold">Analyzing Prescription...</p>
        <p className="mt-1 text-sm text-gray-500">This may take a few moments.</p>
    </div>
);

export default LoadingSpinner;
