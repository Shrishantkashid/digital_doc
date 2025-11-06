import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PrescriptionAnalyzer from './components/PrescriptionAnalyzer';
import MentalHealthMonitor from './components/MentalHealthMonitor';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { Tool, Language } from './types';
// MongoDB connection will be handled through backend API calls

function App() {
  // Initialize state with error boundary fallback
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentToolView, setCurrentToolView] = useState<Tool>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);
  
  // Add debug logging
  useEffect(() => {
    console.log('App rendered - Authenticated:', isAuthenticated, 'Current view:', currentToolView);
  }, [isAuthenticated, currentToolView]);

  // Database operations will be handled through backend API calls

  const handleLogin = async (username: string, password: string) => {
    try {
      // In a real app, you'd validate credentials against a backend
      console.log('Attempting login with:', { username, password });
      
      // For now, we'll just set isAuthenticated to true
      // In a real implementation, you would get the user ID from the auth service response
      setIsAuthenticated(true);
      setUserId('temp-user-id'); // This should be the actual user ID from the database
      setCurrentToolView('landing'); // Navigate to landing page after successful login
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleSignup = async (username: string, password: string) => {
    try {
      // In a real app, you'd register the user and then log them in
      console.log('Attempting signup with:', { username, password });
      
      // For now, we'll just set isAuthenticated to true
      // In a real implementation, you would get the user ID from the auth service response
      setIsAuthenticated(true);
      setUserId('temp-user-id'); // This should be the actual user ID from the database
      setCurrentToolView('landing'); // Navigate to landing page after successful signup
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentToolView('landing'); // Reset to landing or auth page
    // Clear any user-specific data here
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {currentToolView === 'landing' && (
            <LandingPage onToolSelect={handleToolSelect} />
          )}
          {currentToolView === 'prescription' && (
            <PrescriptionAnalyzer language={currentLanguage} userId={userId} />
          )}
          {currentToolView === 'mentalHealth' && (
            <MentalHealthMonitor language={currentLanguage} />
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