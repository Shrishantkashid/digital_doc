import React from 'react';
import { Language } from '../types';

interface HeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
    onHomeClick: () => void;
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
}

// Language names mapping
const languageNames: Record<Language, string> = {
    en: 'English',
    hi: 'हिन्दी',
    te: 'తెలుగు',
    ta: 'தமிழ்',
    kn: 'ಕನ್ನಡ',
    ml: 'മലയാളം',
    mr: 'मराठी',
    bn: 'বাংলা',
    gu: 'ગુજરાતી',
    pa: 'ਪੰਜਾਬੀ'
};

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout, onHomeClick, currentLanguage, onLanguageChange }) => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={onHomeClick} className="flex items-center text-white focus:outline-none">
                            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.757 16.243l1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-1.414-1.414a2 2 0 00-2.828 0l-2.829 2.829a2 2 0 000 2.828z" />
                            </svg>
                            <span className="text-white text-2xl font-bold ml-3">Digital Doctor AI</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative inline-block text-left">
                            <select
                                id="language-select"
                                value={currentLanguage}
                                onChange={(e) => onLanguageChange(e.target.value as Language)}
                                className="block w-full px-3 py-1 text-sm bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.entries(languageNames).map(([code, name]) => (
                                    <option key={code} value={code}>{name}</option>
                                ))}
                            </select>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;