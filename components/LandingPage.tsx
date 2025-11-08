import React from 'react';
import FeatureCard from './FeatureCard';
import { Tool } from '../types';
import { TranslationKeys } from '../services/translationService';

interface LandingPageProps {
    onToolSelect: (tool: Tool) => void;
    t?: Record<keyof TranslationKeys, string>;
}

const SafetyCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const CostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M12 6h.01M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const HeadsetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3H12m-9 0h18M11.25 18.75H12c-.545 0-1.077-.042-1.597-.123C9.742 18.067 8.525 17.5 7.5 16.5m10.5 0c-.545 0-1.077-.042-1.597-.123C14.258 18.067 13.042 17.5 12 16.5m-1.25-6v-4.5m2.5 0v4.5m2.5-4.5v4.5m-7.5-4.5v4.5" />
</svg>

const LandingPage: React.FC<LandingPageProps> = ({ onToolSelect, t }) => {
    // Default translations (English)
    const defaultT = {
        welcomeTitle: 'Welcome to Digital Doctor AI',
        welcomeDescription: 'Your advanced AI-powered health assistant for prescription validation, dosage verification, and mental health monitoring. Upload prescriptions, check for drug interactions, and get personalized health insights.',
        prescriptionValidator: 'Prescription Validator',
        mentalHealthMonitor: 'Mental Health Monitor'
    };
    
    // Use provided translations or fall back to defaults
    const translations = t || defaultT;

    // Generate 50 particles with proper animation properties
    const particles = Array.from({ length: 50 }).map((_, i) => (
        <div
            key={i}
            className="particle"
            style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                // Remove CSS variables that might cause parsing issues
            } as React.CSSProperties}
        ></div>
    ));

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden flex flex-col justify-center items-center py-16 px-4">
            <div className="background-particles absolute inset-0">
                {particles}
            </div>
            <div className="relative z-10 w-full max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    Welcome to Digital Doctor AI
                </h1>
                <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
                    Your advanced AI-powered health assistant for prescription validation, dosage verification, and mental health monitoring. Upload prescriptions, check for drug interactions, and get personalized health insights.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <button 
                        onClick={() => onToolSelect('prescription')} 
                        className="block w-full text-left"
                    >
                        <FeatureCard
                            icon={<SafetyCheckIcon />}
                            title={translations.prescriptionValidator}
                            description="Upload your prescription to check for drug interactions, allergies, and safety warnings. Get cost-saving insights."
                        />
                    </button>
                    <button 
                        onClick={() => onToolSelect('mentalHealth')} 
                        className="block w-full text-left"
                    >
                        <FeatureCard
                            icon={<HeadsetIcon />}
                            title={translations.mentalHealthMonitor}
                            description="Record a voice entry for AI sentiment analysis, crisis detection, and personalized wellness recommendations."
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;