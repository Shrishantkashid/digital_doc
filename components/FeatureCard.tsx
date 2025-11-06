import React from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center' as const,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s',
        }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center shadow-lg transition-transform hover:scale-105">
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem',
                height: '4rem',
                width: '4rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                margin: '0 auto',
            }}
            className="flex justify-center items-center mb-4 h-16 w-16 rounded-full bg-white/20 mx-auto">
                {icon}
            </div>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold' as const,
                color: 'white',
                marginBottom: '0.5rem',
            }}
            className="text-xl font-bold text-white mb-2">{title}</h3>
            <p style={{
                color: '#dbeafe',
                fontSize: '0.875rem',
            }}
            className="text-blue-100 text-sm">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;