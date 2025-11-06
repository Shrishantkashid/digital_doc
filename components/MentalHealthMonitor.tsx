import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { analyzeMentalHealthAudio, generateMentalHealthTestContent } from '../services/geminiService';
import { MentalHealthAnalysisResult, Language } from '../types';

interface MentalHealthMonitorProps {
    language: Language;
}

// Add an interface for icon props
interface IconProps {
    className?: string;
}

// Update MicIcon to accept IconProps
const MicIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3H12m-9 0h18M11.25 18.75H12c-.545 0-1.077-.042-1.597-.123C9.742 18.067 8.525 17.5 7.5 16.5m10.5 0c-.545 0-1.077-.042-1.597-.123C14.258 18.067 13.042 17.5 12 16.5m-1.25-6v-4.5m2.5 0v4.5m2.5-4.5v4.5m-7.5-4.5v4.5" />
</svg>;

// Update PlayIcon to accept IconProps
const PlayIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.353 1.62-1.066l10.95 4.39c.976.391.976 1.831 0 2.223l-10.95 4.39c-.703.287-1.62-.207-1.62-1.063V5.653z" />
</svg>;

// Update StopIcon to accept IconProps
const StopIcon: React.FC<IconProps> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
</svg>;


const MentalHealthMonitor: React.FC<MentalHealthMonitorProps> = ({ language }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<MentalHealthAnalysisResult | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [aiGeneratedText, setAiGeneratedText] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);


    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const intervalRef = useRef<number | null>(null);

    const startRecording = async () => {
        try {
            // Only clear existing audio/analysis results, not the test scenario text itself
            setAudioBlob(null);
            setAudioURL(null);
            setAnalysisResult(null);
            setError(null);
            setStatusMessage(null); // Clear any previous status messages


            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            setRecordingTime(0);

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(recordedBlob);
                setAudioURL(URL.createObjectURL(recordedBlob));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            intervalRef.current = window.setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please ensure permissions are granted.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    };

    const handleAnalyze = async () => {
        if (!audioBlob) {
            setError('Please record your voice first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeMentalHealthAudio({ audioBlob, language });
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('An error occurred during analysis. This could be due to a network issue, an invalid API key, or an issue with the AI model. Please check the console for details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateTestContent = async () => {
        setIsLoading(true);
        setError(null);
        setAiGeneratedText(null); // Clear previous generated text before generating new one
        setAudioBlob(null); // Clear any previous audio
        setAudioURL(null);
        setAnalysisResult(null);
        setStatusMessage(null); // Clear any previous status messages


        try {
            const content = await generateMentalHealthTestContent(language);
            setAiGeneratedText(content);
        } catch (err) {
            console.error('Error generating test content:', err);
            setError('Failed to generate test content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        // Cleanup function for object URL
        return () => {
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [audioURL]);

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mental Health Monitor</h1>
                <p className="mt-2 text-gray-600">
                    Record a voice journal entry and our AI will analyze it for sentiment, crisis detection, and provide personalized wellness recommendations.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mt-4">
                    <p className="text-sm text-yellow-700">
                        <strong>Disclaimer:</strong> This is an AI-generated analysis and not a substitute for professional mental health care. If you are in crisis, please seek immediate professional help.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
                {isRecording ? (
                    <div className="flex items-center space-x-4 bg-red-100 p-4 rounded-full shadow-lg">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute w-full h-full border-4 border-red-500 rounded-full animate-ping-slow"></div>
                            {/* Pass className prop to MicIcon */}
                            <MicIcon className="h-10 w-10 text-red-600" />
                        </div>
                        <p className="text-red-700 text-xl font-semibold">{formatTime(recordingTime)}</p>
                        <button
                            onClick={stopRecording}
                            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
                            aria-label="Stop Recording"
                        >
                            {/* Pass className prop to StopIcon */}
                            <StopIcon className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={startRecording}
                        disabled={isLoading}
                        className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {/* Pass className prop to MicIcon */}
                        <MicIcon className="w-6 h-6" />
                        <span>Start Recording</span>
                    </button>
                )}

                {audioURL && !isRecording && (
                    <div className="flex items-center space-x-4 mt-4">
                        <audio controls src={audioURL} className="w-full max-w-sm" />
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze Audio'}
                        </button>
                    </div>
                )}
            </div>

            {/* New section for AI-generated test content */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Test Mental Health Scenarios</h2>
                <p className="text-gray-600">
                    Generate AI-powered text scenarios to test the sentiment analysis. Read the generated text aloud into the microphone for analysis.
                </p>
                <button
                    onClick={handleGenerateTestContent}
                    disabled={isLoading || isRecording}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading && !aiGeneratedText ? 'Generating...' : 'Generate Test Scenario'}
                </button>

                {aiGeneratedText && (
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Generated Text:</h3>
                        <p className="text-gray-700 italic border border-gray-200 p-3 rounded-md min-h-[100px] bg-white text-base">
                            {aiGeneratedText}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            *Read this text aloud into the microphone for the AI to analyze your voice and sentiment.
                        </p>
                    </div>
                )}
            </div>

            {statusMessage && (
                <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="status">
                    <p>{statusMessage}</p>
                </div>
            )}


            {isLoading && <LoadingSpinner />}

            {error && (
                <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {analysisResult && (
                <div className="mt-8 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Analysis Report</h2>
                    
                    {analysisResult.crisisDetected && (
                        <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center animate-pulse-slow">
                            <p className="text-3xl font-extrabold mb-2">🚨 CRISIS ALERT 🚨</p>
                            <p className="text-lg font-semibold mb-3">{analysisResult.crisisMessage || "Immediate signs of distress detected."}</p>
                            <p className="text-base">If you are in danger, please reach out for immediate help:</p>
                            <p className="text-xl font-bold mt-2">National Crisis and Suicide Lifeline: <a href="tel:988" className="underline hover:text-blue-200">988</a></p>
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800">Transcription:</h3>
                        <p className="text-gray-700 italic mt-1">{analysisResult.transcription}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">Detected Sentiment:</h3>
                            <p className="text-blue-700 text-xl font-bold mt-1">{analysisResult.sentiment}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">Confidence Score:</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-green-600 h-2.5 rounded-full" 
                                        style={{ width: `${analysisResult.confidenceScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-green-700 font-bold">{analysisResult.confidenceScore}%</span>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800">Recommendations:</h3>
                            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                                {analysisResult.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentalHealthMonitor;