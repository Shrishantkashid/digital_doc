export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
}

export interface Interaction {
    drugs: string[];
    description: string;
    severity: 'High' | 'Moderate' | 'Low';
}

export interface AllergyAlert {
    drug: string;
    warning: string;
}

export interface EnhancedSafetyAlert {
    drug: string;
    alertType: string;
    warning: string;
}

export interface CostOptimization {
    brandName: string;
    genericAlternative: string;
    notes: string;
    currentPrice?: string;
    availability?: string; // Simulated availability
}

export interface AnalysisResult {
    analysisConfidence: 'High' | 'Medium' | 'Low';
    confidenceScore: number; // New numerical confidence score (0-100)
    confidenceReasoning: string;
    medications: Medication[];
    interactions: Interaction[];
    allergyAlerts: AllergyAlert[];
    enhancedSafetyAlerts: EnhancedSafetyAlert[];
    costOptimization: CostOptimization[];
}

export interface MentalHealthAnalysisResult {
    transcription: string;
    sentiment: 'Neutral' | 'Anxious' | 'Depressed' | 'Hopeful' | 'Calm' | 'Stressed' | 'Angry';
    confidenceScore: number; // New numerical confidence score (0-100)
    crisisDetected: boolean;
    crisisMessage?: string;
    recommendations: string[];
}

export type Tool = 'landing' | 'prescription' | 'mentalHealth';

// Extended language support
export type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu' | 'pa';