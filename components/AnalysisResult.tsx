import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import ResultSection from './ResultSection';
import ConfidenceDisplay from './ConfidenceDisplay';

interface AnalysisResultProps {
    result: AnalysisResultType;
}

const PillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.757 16.243l1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-1.414-1.414a2 2 0 00-2.828 0l-2.829 2.829a2 2 0 000 2.828z" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const CurrencyDollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M12 6h.01M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;


const getSeverityClass = (severity: 'High' | 'Moderate' | 'Low') => {
    switch (severity) {
        case 'High': return 'border-red-500 bg-red-50';
        case 'Moderate': return 'border-orange-500 bg-orange-50';
        case 'Low': return 'border-yellow-400 bg-yellow-50';
        default: return 'border-gray-300 bg-gray-50';
    }
};

const getConfidenceClass = (confidence: 'High' | 'Medium' | 'Low') => {
    switch (confidence) {
        case 'High': return 'bg-green-100 text-green-800 border-green-400';
        case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-400';
        case 'Low': return 'bg-red-100 text-red-800 border-red-400';
        default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
    return (
        <div className="w-full space-y-6">
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                         <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.02-1.742 3.02H4.42c-1.532 0-2.492-1.686-1.742-3.02l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <strong>Disclaimer:</strong> This is an AI-generated analysis and not a substitute for professional medical advice. Always consult your doctor or pharmacist before making any changes to your medication.
                            Please note that pricing and availability information are simulated and may not reflect real-time data.
                        </p>
                    </div>
                </div>
            </div>

            <ResultSection title="Analysis Confidence" icon={<CheckCircleIcon />}>
                <ConfidenceDisplay 
                    confidence={result.analysisConfidence} 
                    score={result.confidenceScore} 
                    reasoning={result.confidenceReasoning} 
                />
            </ResultSection>

            {result.allergyAlerts.length > 0 && (
                <ResultSection title="Allergy Alerts" icon={<ShieldExclamationIcon />}>
                    {result.allergyAlerts.map((alert, index) => (
                        <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
                            <p className="font-bold text-red-800">Potential conflict with <span className="underline">{alert.drug}</span></p>
                            <p className="text-sm text-red-700 mt-1">{alert.warning}</p>
                        </div>
                    ))}
                </ResultSection>
            )}

            {result.enhancedSafetyAlerts.length > 0 && (
                 <ResultSection title="Enhanced Safety Alerts" icon={<HeartIcon />}>
                    {result.enhancedSafetyAlerts.map((alert, index) => (
                        <div key={index} className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-md">
                            <div className="flex justify-between items-start">
                                 <p className="font-bold text-purple-800">
                                    {alert.alertType} warning for <span className="underline">{alert.drug}</span>
                                </p>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-200 text-purple-700 border border-purple-300">
                                    {alert.alertType}
                                </span>
                            </div>
                            <p className="text-sm text-purple-700 mt-1">{alert.warning}</p>
                        </div>
                    ))}
                </ResultSection>
            )}

            {result.interactions.length > 0 && (
                <ResultSection title="Drug Interactions" icon={<AlertTriangleIcon />}>
                    {result.interactions.map((interaction, index) => (
                        <div key={index} className={`p-4 border-l-4 rounded-md ${getSeverityClass(interaction.severity)}`}>
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-gray-800">{interaction.drugs.join(' + ')}</p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityClass(interaction.severity)} border ${getSeverityClass(interaction.severity).replace('bg','text').replace('-50','-600')}`}>
                                    {interaction.severity} Risk
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{interaction.description}</p>
                        </div>
                    ))}
                </ResultSection>
            )}

            <ResultSection title="Identified Medications" icon={<PillIcon />}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {result.medications.map((med, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ResultSection>

            {result.costOptimization.length > 0 && (
                <ResultSection title="Cost Optimization" icon={<CurrencyDollarIcon />}>
                     {result.costOptimization.map((opt, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                            <p className="font-semibold text-gray-800">For <span className="font-bold">{opt.brandName}</span>, consider <span className="font-bold text-green-700">{opt.genericAlternative}</span>.</p>
                            <p className="text-sm text-gray-600 mt-1">{opt.notes}</p>
                            {opt.currentPrice && (
                                <p className="text-sm text-gray-600 mt-1"><strong>Simulated Price:</strong> {opt.currentPrice}</p>
                            )}
                            {opt.availability && (
                                <p className="text-sm text-gray-600 mt-1"><strong>Simulated Availability:</strong> {opt.availability}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2 italic">
                                *Pricing and availability are simulated for demonstration purposes. Always verify with your local pharmacy.
                            </p>
                        </div>
                    ))}
                </ResultSection>
            )}

        </div>
    );
};

export default AnalysisResult;