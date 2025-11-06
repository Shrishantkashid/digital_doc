import React from 'react';

interface PatientInfoFormProps {
    age: string;
    setAge: (value: string) => void;
    conditions: string;
    setConditions: (value: string) => void;
    isPregnant: boolean;
    setIsPregnant: (value: boolean) => void;
    isBreastfeeding: boolean;
    setIsBreastfeeding: (value: boolean) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
    age,
    setAge,
    conditions,
    setConditions,
    isPregnant,
    setIsPregnant,
    isBreastfeeding,
    setIsBreastfeeding,
}) => {
    return (
        <div className="space-y-4">
             <div className="border-t border-gray-200 pt-4">
                 <h3 className="text-lg font-medium text-gray-800">Additional Information (Optional)</h3>
                 <p className="mt-1 text-sm text-gray-500">Providing these details helps us perform a more thorough safety check.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g., 35"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="conditions" className="block text-sm font-medium text-gray-700">
                        Pre-existing Conditions
                    </label>
                    <input
                        type="text"
                        id="conditions"
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                        placeholder="e.g., Kidney Disease, High Blood Pressure"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center">
                    <input
                        id="isPregnant"
                        type="checkbox"
                        checked={isPregnant}
                        onChange={(e) => setIsPregnant(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPregnant" className="ml-2 block text-sm text-gray-900">
                        Pregnant
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="isBreastfeeding"
                        type="checkbox"
                        checked={isBreastfeeding}
                        onChange={(e) => setIsBreastfeeding(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isBreastfeeding" className="ml-2 block text-sm text-gray-900">
                        Breastfeeding
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PatientInfoForm;
