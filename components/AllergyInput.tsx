
import React from 'react';

interface AllergyInputProps {
    allergies: string;
    onAllergiesChange: (value: string) => void;
}

const AllergyInput: React.FC<AllergyInputProps> = ({ allergies, onAllergiesChange }) => {
    return (
        <div className="w-full">
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                List Your Allergies (optional)
            </label>
            <input
                type="text"
                id="allergies"
                value={allergies}
                onChange={(e) => onAllergiesChange(e.target.value)}
                placeholder="e.g., Penicillin, Aspirin, Sulfa drugs"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
             <p className="mt-1 text-xs text-gray-500">Separate multiple allergies with a comma.</p>
        </div>
    );
};

export default AllergyInput;
