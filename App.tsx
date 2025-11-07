import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PrescriptionAnalyzer from './components/PrescriptionAnalyzer';
import MentalHealthMonitor from './components/MentalHealthMonitor';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ChatBot from './components/ChatBot'; // Add ChatBot import
import { Tool, Language } from './types';
import { useTranslation } from './services/translationService';
// MongoDB connection will be handled through backend API calls

function App() {
  // Initialize state with error boundary fallback
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentToolView, setCurrentToolView] = useState<Tool>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);
  
  // Get translations for the current language
  const t = useTranslation(currentLanguage);
  
  // Check for saved authentication state on app initialization
  useEffect(() => {
    const savedAuthState = localStorage.getItem('digitalDoctorAuth');
    if (savedAuthState) {
      try {
        const { isAuthenticated: savedIsAuthenticated, userId: savedUserId } = JSON.parse(savedAuthState);
        if (savedIsAuthenticated && savedUserId) {
          setIsAuthenticated(savedIsAuthenticated);
          setUserId(savedUserId);
          setCurrentToolView('landing');
        }
      } catch (e) {
        console.error('Failed to parse saved auth state:', e);
      }
    }
  }, []);
  
  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      const authState = {
        isAuthenticated,
        userId
      };
      localStorage.setItem('digitalDoctorAuth', JSON.stringify(authState));
    }
  }, [isAuthenticated, userId]);
  
  // Add debug logging
  useEffect(() => {
    console.log('App rendered - Authenticated:', isAuthenticated, 'Current view:', currentToolView);
  }, [isAuthenticated, currentToolView]);

  // Database operations will be handled through backend API calls

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log('Attempting login with:', { username, password });
      
      // Simple validation
      if (!username || !password) {
        throw new Error('Please enter both username and password');
      }
      
      // For demo purposes, we'll accept any non-empty credentials
      // In a real app, you would validate against a backend service
      console.log('Login successful (demo mode)');
      const newUserId = 'user-' + Date.now();
      setIsAuthenticated(true);
      setUserId(newUserId);
      setCurrentToolView('landing');
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      alert(`Login failed: ${errorMessage}`);
    }
  };

  const handleSignup = async (username: string, password: string) => {
    try {
      console.log('Attempting signup with:', { username, password });
      
      // Simple validation
      if (!username || !password) {
        throw new Error('Please enter both username and password');
      }
      
      // For demo purposes, we'll accept any non-empty credentials
      // In a real app, you would register with a backend service
      console.log('Signup successful (demo mode)');
      const newUserId = 'user-' + Date.now();
      setIsAuthenticated(true);
      setUserId(newUserId);
      setCurrentToolView('landing');
    } catch (error) {
      console.error('Signup failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      alert(`Signup failed: ${errorMessage}`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setCurrentToolView('landing'); // Reset to landing or auth page
    // Clear any user-specific data here
    localStorage.removeItem('digitalDoctorAuth');
  };

  const handleToolSelect = (tool: Tool) => {
    setCurrentToolView(tool);
  };

  const handleHomeClick = () => {
    setCurrentToolView('landing');
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  // Debug authentication state
  console.log('Authentication state:', { isAuthenticated, currentToolView });
  
  if (!isAuthenticated) {
    console.log('Rendering AuthPage');
    return <AuthPage 
      onLogin={handleLogin} 
      onSignup={handleSignup} 
      onError={(errorMessage) => setError(errorMessage)} 
    />;
  }
  
  console.log('Rendering main app with view:', currentToolView);

  // Render LandingPage outside the main container to avoid white borders
  if (currentToolView === 'landing') {
    return (
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onHomeClick={handleHomeClick}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          currentToolView={currentToolView}
          onToolSelect={handleToolSelect}
          t={t}
        />
        <main className="flex-grow">
          <LandingPage onToolSelect={handleToolSelect} t={t} />
        </main>
        <footer className="text-center py-4 text-gray-500 text-sm">
          <p>Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.</p>
        </footer>
      </div>
    );
  }

  // Render other views inside the container
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentToolView={currentToolView}
        onToolSelect={handleToolSelect}
        t={t}
      />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {currentToolView === 'prescription' && (
            <PrescriptionAnalyzer language={currentLanguage} userId={userId} />
          )}
          {currentToolView === 'mentalHealth' && (
            <MentalHealthMonitor language={currentLanguage} />
          )}
          {currentToolView === 'chatbot' && (
            <ChatBot language={currentLanguage} onClose={() => setCurrentToolView('landing')} />
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}

export default App;