import React from 'react';

interface ConfidenceDisplayProps {
    confidence: 'High' | 'Medium' | 'Low';
    score: number;
    reasoning: string;
}

const getConfidenceClass = (confidence: 'High' | 'Medium' | 'Low') => {
    switch (confidence) {
        case 'High': return 'bg-green-100 text-green-800 border-green-400';
        case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-400';
        case 'Low': return 'bg-red-100 text-red-800 border-red-400';
        default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
};

const ConfidenceDisplay: React.FC<ConfidenceDisplayProps> = ({ confidence, score, reasoning }) => {
    return (
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border whitespace-nowrap ${getConfidenceClass(confidence)}`}>
                {confidence} Confidence
            </span>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Score:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{score}%</span>
            </div>
            <p className="text-sm text-gray-600 italic">{reasoning}</p>
        </div>
    );
};

export default ConfidenceDisplay;