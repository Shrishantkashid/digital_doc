import React from 'react';
import FeatureCard from './FeatureCard';
import { Tool } from '../types';

interface LandingPageProps {
    onToolSelect: (tool: Tool) => void;
}

const SafetyCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const CostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M12 6h.01M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const HeadsetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3H12m-9 0h18M11.25 18.75H12c-.545 0-1.077-.042-1.597-.123C9.742 18.067 8.525 17.5 7.5 16.5m10.5 0c-.545 0-1.077-.042-1.597-.123C14.258 18.067 13.042 17.5 12 16.5m-1.25-6v-4.5m2.5 0v4.5m2.5-4.5v4.5m-7.5-4.5v4.5" />
</svg>

const LandingPage: React.FC<LandingPageProps> = ({ onToolSelect }) => {
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

    // Add inline styles as fallback in case Tailwind isn't loading
    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #1e3a8a, #4c1d95)',
        color: 'white',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        display: 'flex' as const,
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: '4rem'
    };

    return (
        <div style={containerStyle} className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden flex flex-col justify-center items-center py-16">
            <div className="background-particles">
                {particles}
            </div>
            {/* Debug: Add a simple visible element to ensure content is rendering */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'red', zIndex: 1000 }}>
                Landing Page Loaded
            </div>
            {/* Add inline styles for critical elements */}
            <div style={{
                width: '100%',
                maxWidth: '768px',
                margin: '0 auto',
                padding: '4rem 1.5rem',
                textAlign: 'center' as const,
                zIndex: 10
            }} className="container mx-auto px-6 py-16 text-center z-10">
                {/* Fix JSX syntax by properly closing the h1 tag */}
                <h1 style={{
                    fontSize: '2.5rem',
                    lineHeight: '1.2',
                    fontWeight: '900' as const,
                    marginBottom: '1rem'
                }} className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    Your Personal AI Health Assistant
                </h1>
                {/* Fix JSX syntax by properly closing the p tag */}
                <p style={{
                    fontSize: '1.125rem',
                    color: '#93c5fd',
                    marginBottom: '2rem',
                    maxWidth: '48rem',
                    margin: '0 auto'
                }} className="text-lg md:text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
                    Choose a tool below to get started with intelligent health insights.
                </p>
                
                {/* Fix JSX syntax by properly closing the div tag */}
                <div style={{
                    display: 'grid' as const,
                    gridTemplateColumns: '1fr',
                    gap: '2rem',
                    maxWidth: '64rem',
                    margin: '3rem auto 0',
                }} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                    {/* Fix JSX syntax by properly closing the button tag */}
                    <button 
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left' as const,
                            border: 'none',
                            background: 'none',
                            padding: 0,
                            cursor: 'pointer'
                        }} 
                        onClick={() => onToolSelect('prescription')} 
                        className="block w-full text-left"
                    >
                        <FeatureCard
                            icon={<SafetyCheckIcon />}
                            title="Prescription Validator"
                            description="Upload your prescription to check for drug interactions, allergies, and safety warnings. Get cost-saving insights."
                        />
                    </button>
                    {/* Fix JSX syntax by properly closing the button tag */}
                    <button 
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left' as const,
                            border: 'none',
                            background: 'none',
                            padding: 0,
                            cursor: 'pointer'
                        }} 
                        onClick={() => onToolSelect('mentalHealth')} 
                        className="block w-full text-left"
                    >
                        <FeatureCard
                            icon={<HeadsetIcon />}
                            title="Mental Health Monitor"
                            description="Record a voice entry for AI sentiment analysis, crisis detection, and personalized wellness recommendations."
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;