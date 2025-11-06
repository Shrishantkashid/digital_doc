
import React from 'react';

interface ResultSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const ResultSection: React.FC<ResultSectionProps> = ({ title, icon, children }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <div className="mr-3">{icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export default ResultSection;
