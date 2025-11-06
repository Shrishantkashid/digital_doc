import React, { useState } from 'react';
import PrescriptionUploader from './PrescriptionUploader';
import AllergyInput from './AllergyInput';
import PatientInfoForm from './PatientInfoForm';
import LoadingSpinner from './LoadingSpinner';
import AnalysisResultComponent from './AnalysisResult';
import { analyzePrescription } from '../services/geminiService';
import { prescriptionService } from '../src/services';
import { AnalysisResult, Language } from '../types';

interface PrescriptionAnalyzerProps {
    language: Language;
    userId: string | null;
}

const PrescriptionAnalyzer: React.FC<PrescriptionAnalyzerProps> = ({ language, userId }: PrescriptionAnalyzerProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [allergies, setAllergies] = useState('');
    const [age, setAge] = useState('');
    const [conditions, setConditions] = useState('');
    const [isPregnant, setIsPregnant] = useState(false);
    const [isBreastfeeding, setIsBreastfeeding] = useState(false);

    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError('Please upload a prescription image first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzePrescription({
                imageFile: selectedFile,
                allergies,
                age,
                conditions,
                isPregnant,
                isBreastfeeding,
                language,
            });
            
            // Convert file to base64 for storage
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile as File);
            reader.onload = async () => {
              const base64Image = reader.result as string;
              
              // Extract medications from result
              const medications = result.medications.map(med => ({
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency
              }));
              
              // Save prescription to database (assuming we have userId from authentication)
              // In a real app, you would get the userId from the authenticated user session
              try {
                // Use the userId passed as a prop or from context
                // In this implementation, we'll need to pass userId as a prop from App
                if (userId) {
                  await prescriptionService.savePrescription(
                    userId,
                    base64Image,
                    medications,
                    allergies,
                    age,
                    conditions,
                    isPregnant,
                    isBreastfeeding,
                    result
                  );
                  console.log('Prescription saved to database');
                } else {
                  console.warn('No user ID available to save prescription');
                }
              } catch (saveError) {
                console.error('Failed to save prescription:', saveError);
                // Don't prevent the analysis from showing even if saving fails
                setError('Failed to save prescription to database. ' + (saveError instanceof Error ? saveError.message : 'Unknown error'));
              }
            };
            
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('An error occurred during analysis. This could be due to a network issue, an invalid API key, or an issue with the AI model. Please check the console for details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Prescription Analysis</h1>
                <p className="mt-2 text-gray-600">
                    Upload an image of your prescription and provide any relevant health information. Our AI will analyze it for potential issues and insights.
                </p>
            </div>

            <div className="space-y-4">
                <PrescriptionUploader onFileSelect={setSelectedFile} />
                <AllergyInput allergies={allergies} onAllergiesChange={setAllergies} />
                <PatientInfoForm 
                    age={age}
                    setAge={setAge}
                    conditions={conditions}
                    setConditions={setConditions}
                    isPregnant={isPregnant}
                    setIsPregnant={setIsPregnant}
                    isBreastfeeding={isBreastfeeding}
                    setIsBreastfeeding={setIsBreastfeeding}
                />
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Prescription'}
                </button>
            </div>

            {isLoading && <LoadingSpinner />}
            
            {error && (
                <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {analysisResult && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Analysis Report</h2>
                    <AnalysisResultComponent result={analysisResult} />
                </div>
            )}
        </div>
    );
};

export default PrescriptionAnalyzer;