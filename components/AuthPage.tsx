import React, { useState } from 'react';
import { authService } from '../src/services';

interface AuthPageProps {
    onLogin: (username: string, password: string) => void;
    onSignup: (username: string, password: string) => void;
    onError?: (error: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, onError }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            if (isLoginView) {
                // Login user
                await authService.login(username, password);
                onLogin(username, password);
            } else {
                // Register new user
                await authService.register(username, password);
                onSignup(username, password);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            // Pass error to parent component if onError callback is provided
            if (onError) {
                onError(errorMessage);
            }
        }
    };

    // Generate 50 particles
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
            }}
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
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        padding: '4rem'
    };

    return (
        <div style={containerStyle} className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden flex items-center justify-center py-16">
            <div className="background-particles">
                {particles}
            </div>
            {/* Add inline styles for critical elements */}
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                textAlign: 'center' as const,
                maxWidth: '28rem',
                width: '100%',
                zIndex: 10
            }} className="bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-xl border border-white/20 shadow-lg text-center max-w-md w-full z-10">
                <h1 className="text-3xl font-extrabold mb-6">
                    {isLoginView ? 'Welcome Back!' : 'Join Digital Doctor'}
                </h1>
                <div className="flex justify-center mb-6">
                    <button
                        style={{
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500' as const,
                            borderRadius: isLoginView ? '0.5rem 0 0 0.5rem' : '0.5rem',
                            backgroundColor: isLoginView ? '#2563eb' : '#374151',
                            color: isLoginView ? 'white' : '#d1d5db',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            if (!isLoginView) {
                                e.currentTarget.style.backgroundColor = '#4b5563';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoginView) {
                                e.currentTarget.style.backgroundColor = '#374151';
                            }
                        }}
                        onClick={() => { setIsLoginView(true); setError(null); }}
                    >
                        Login
                    </button>
                    <button
                        style={{
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500' as const,
                            borderRadius: !isLoginView ? '0 0.5rem 0.5rem 0' : '0.5rem',
                            backgroundColor: !isLoginView ? '#2563eb' : '#374151',
                            color: !isLoginView ? 'white' : '#d1d5db',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            if (isLoginView) {
                                e.currentTarget.style.backgroundColor = '#4b5563';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (isLoginView) {
                                e.currentTarget.style.backgroundColor = '#374151';
                            }
                        }}
                        onClick={() => { setIsLoginView(false); setError(null); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                outline: 'none'
                            }}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Username or Email"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                outline: 'none'
                            }}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Password"
                        />
                    </div>
                    {error && (
                        <p className="text-red-300 text-sm mt-2" role="alert">{error}</p>
                    )}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            fontWeight: 'bold' as const,
                            padding: '0.625rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
                    >
                        {isLoginView ? 'Login' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;