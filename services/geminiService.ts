
import { GoogleGenAI, Type } from "@google/genai";
import { fileToBase64, blobToBase64, encode, createPcmBlob } from "../utils";
import { AnalysisResult, MentalHealthAnalysisResult, Language } from "../types";
import { auditTrail } from "../audit/AuditTrail";
import { drugDatabaseService } from "./DrugDatabaseService";
import { dosageValidationService, type PatientInfo } from "./DosageValidationService";

// Language names mapping for the AI prompt
const languageNames: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu',
    ta: 'Tamil',
    kn: 'Kannada',
    ml: 'Malayalam',
    mr: 'Marathi',
    bn: 'Bengali',
    gu: 'Gujarati',
    pa: 'Punjabi'
};

// The API key is assumed to be available in the environment variables.
const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysisConfidence: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low'],
            description: "Your confidence level in this analysis."
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "Numerical confidence score from 0-100, where 100 is highest confidence.",
            minimum: 0,
            maximum: 100
        },
        confidenceReasoning: {
            type: Type.STRING,
            description: "Brief reasoning for the confidence level, e.g., 'Image is clear' or 'Handwriting is ambiguous'."
        },
        medications: {
            type: Type.ARRAY,
            description: "A list of all medications identified from the prescription.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the medication." },
                    dosage: { type: Type.STRING, description: "Dosage of the medication, e.g., '10mg'." },
                    frequency: { type: Type.STRING, description: "How often to take the medication, e.g., 'Once daily'." }
                },
                required: ["name", "dosage", "frequency"]
            }
        },
        interactions: {
            type: Type.ARRAY,
            description: "A list of potential drug-drug interactions found between the prescribed medications.",
            items: {
                type: Type.OBJECT,
                properties: {
                    drugs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of drugs that interact." },
                    description: { type: Type.STRING, description: "Description of the potential interaction." },
                    severity: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'], description: "Severity of the interaction." }
                },
                required: ["drugs", "description", "severity"]
            }
        },
        allergyAlerts: {
            type: Type.ARRAY,
            description: "A list of alerts if any prescribed medication conflicts with the patient's listed allergies.",
            items: {
                type: Type.OBJECT,
                properties: {
                    drug: { type: Type.STRING, description: "The drug that may cause an allergic reaction." },
                    warning: { type: Type.STRING, description: "Warning message about the allergy." }
                },
                required: ["drug", "warning"]
            }
        },
        enhancedSafetyAlerts: {
            type: Type.ARRAY,
            description: "A list of safety alerts based on the patient's age, conditions, pregnancy, or breastfeeding status.",
            items: {
                type: Type.OBJECT,
                properties: {
                    drug: { type: Type.STRING, description: "The drug associated with the safety alert." },
                    alertType: { type: Type.STRING, description: "Type of alert (e.g., 'Geriatric Warning', 'Pregnancy Warning')." },
                    warning: { type: Type.STRING, description: "Specific warning message for the patient's condition." }
                },
                required: ["drug", "alertType", "warning"]
            }
        },
        costOptimization: {
            type: Type.ARRAY,
            description: "A list of cost-saving suggestions, such as generic alternatives for brand-name drugs, including simulated pricing and availability.",
            items: {
                type: Type.OBJECT,
                properties: {
                    brandName: { type: Type.STRING, description: "The brand-name drug identified." },
                    genericAlternative: { type: Type.STRING, description: "The suggested generic alternative." },
                    notes: { type: Type.STRING, description: "Notes about switching, e.g., 'Consult your doctor before switching'." },
                    currentPrice: { type: Type.STRING, description: "Simulated current price for the generic alternative (e.g., '$15.00 for 30 tablets')." },
                    availability: { type: Type.STRING, description: "Simulated availability (e.g., 'Available at PharmaCo, City Drug Store')." }
                },
                required: ["brandName", "genericAlternative", "notes", "currentPrice", "availability"]
            }
        }
    },
    required: ["analysisConfidence", "confidenceScore", "confidenceReasoning", "medications", "interactions", "allergyAlerts", "enhancedSafetyAlerts", "costOptimization"]
};

const mentalHealthAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        transcription: {
            type: Type.STRING,
            description: "The transcribed text from the audio input."
        },
        sentiment: {
            type: Type.STRING,
            enum: ['Neutral', 'Anxious', 'Depressed', 'Hopeful', 'Calm', 'Stressed', 'Angry'],
            description: "The detected sentiment or emotional tone from the user's voice."
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "Numerical confidence score from 0-100, where 100 is highest confidence.",
            minimum: 0,
            maximum: 100
        },
        crisisDetected: {
            type: Type.BOOLEAN,
            description: "True if language indicating self-harm or severe distress is detected."
        },
        crisisMessage: {
            type: Type.STRING,
            description: "A message with immediate advice if crisis is detected, e.g., 'Please seek immediate help. You are not alone.'"
        },
        recommendations: {
            type: Type.ARRAY,
            description: "Personalized wellness recommendations based on the sentiment analysis.",
            items: { type: Type.STRING }
        }
    },
    required: ["transcription", "sentiment", "confidenceScore", "crisisDetected", "recommendations"]
};


interface AnalyzePrescriptionParams {
    imageFile: File;
    allergies: string;
    age: string;
    conditions: string;
    isPregnant: boolean;
    isBreastfeeding: boolean;
    language: Language;
}

export const analyzePrescription = async ({
    imageFile,
    allergies,
    age,
    conditions,
    isPregnant,
    isBreastfeeding,
    language
}: AnalyzePrescriptionParams): Promise<AnalysisResult> => {

    const base64Image = await fileToBase64(imageFile);
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
        },
    };

    const patientInfo = `
- Allergies: ${allergies || 'None listed'}
- Age: ${age || 'Not provided'}
- Pre-existing conditions: ${conditions || 'None listed'}
- Pregnant: ${isPregnant ? 'Yes' : 'No'}
- Breastfeeding: ${isBreastfeeding ? 'Yes' : 'No'}
    `.trim();

    const textPart = {
        text: `You are an expert pharmacist AI. Your task is to analyze the provided image of a medical prescription and the patient's health profile.
        
Patient Health Profile:
${patientInfo}

Please perform the following checks and provide the output in a structured JSON format. **All textual responses within the JSON object should be in ${languageNames[language]}**.

1.  **Medication Identification**: Identify all medications, their dosages, and frequencies from the prescription. If information is not available, use "N/A".
2.  **Drug Interactions**: Check for potential interactions between the prescribed medications.
3.  **Allergy Alerts**: Cross-reference the medications with the patient's list of allergies.
4.  **Enhanced Safety Alerts**: Check for contraindications or warnings related to the patient's age, pre-existing conditions, pregnancy, or breastfeeding status.
5.  **Cost Optimization**: Suggest generic alternatives for any brand-name drugs. For each generic alternative, **simulate** providing current pricing and local availability information. Assume you have access to up-to-date pharmaceutical databases for this simulation.
6.  **Confidence Score**: Provide a confidence level (High, Medium, or Low) for the analysis and a brief reason (e.g., clarity of the image, legibility of handwriting).

Return *only* the JSON object that adheres to the provided schema. Do not include any explanatory text, markdown formatting, or code blocks before or after the JSON. If no interactions, alerts, or optimizations are found, return an empty array for the corresponding key.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using gemini-2.5-flash for multimodal text+image processing
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        }
    });

    const jsonText = response.text.trim();
    // The response from the API with responseSchema should be a valid JSON string.
    let result = JSON.parse(jsonText) as AnalysisResult;
    
    // Enhance safety alerts with dosage validation
    const enhancedSafetyAlerts = [...result.enhancedSafetyAlerts];
    
    // Create patient info object for dosage validation
    const patientData: PatientInfo = {
      age: age ? parseInt(age, 10) : 0,
      conditions: conditions ? conditions.split(',').map(c => c.trim()) : [],
      isPregnant: isPregnant,
      isBreastfeeding: isBreastfeeding
    };
    
    // Validate dosages for each medication
    for (const medication of result.medications) {
      const validation = dosageValidationService.validateDosage(
        medication.name,
        medication.dosage,
        medication.frequency,
        patientData
      );
      
      // Add warnings if dosage validation failed
      if (!validation.isValid) {
        enhancedSafetyAlerts.push({
          drug: medication.name,
          alertType: 'Dosage Warning',
          warning: `Prescribed dosage may not be appropriate. Recommended: ${validation.recommendedDosage}, ${validation.recommendedFrequency}`
        });
      }
      
      // Add any additional warnings
      for (const warning of validation.warnings) {
        enhancedSafetyAlerts.push({
          drug: medication.name,
          alertType: 'Dosage Warning',
          warning
        });
      }
      
      // Add contraindications
      for (const contraindication of validation.contraindications) {
        enhancedSafetyAlerts.push({
          drug: medication.name,
          alertType: 'Contraindication',
          warning: contraindication
        });
      }
    }
    
    // Update the result with enhanced safety alerts
    result = {
      ...result,
      enhancedSafetyAlerts
    };
    
    // Enhance cost optimization with real-time drug database information
    const enhancedCostOptimization = [];
    for (const opt of result.costOptimization) {
      // Get real-time drug information
      const drugInfo = await drugDatabaseService.getDrugInfo(opt.brandName);
      
      if (drugInfo) {
        // Get real generic alternatives
        const realGenerics = await drugDatabaseService.getGenericAlternatives(opt.brandName);
        
        // Use the first real generic if available, otherwise keep the AI suggestion
        const genericAlternative = realGenerics.length > 0 ? realGenerics[0] : opt.genericAlternative;
        
        // Get real pricing information
        const pharmacyPrices = drugInfo.typicalPrices;
        
        // Select the best price (lowest)
        let bestPrice = opt.currentPrice || '$0.00 for 30 tablets';
        let bestAvailability = opt.availability || 'Unknown';
        
        for (const [pharmacy, info] of Object.entries(pharmacyPrices)) {
          // Simple price comparison (in a real implementation, we would parse the actual prices)
          if (info.availability === 'In Stock') {
            bestPrice = info.price;
            bestAvailability = `Available at ${pharmacy}`;
            break;
          }
        }
        
        enhancedCostOptimization.push({
          ...opt,
          genericAlternative,
          currentPrice: bestPrice,
          availability: bestAvailability
        });
      } else {
        // If we can't get real information, keep the AI suggestion
        enhancedCostOptimization.push(opt);
      }
    }
    
    // Update the result with enhanced cost optimization
    result = {
      ...result,
      costOptimization: enhancedCostOptimization
    };
    
    // Log the analysis decision to the audit trail
    // In a real implementation, we would get the actual user ID from the session
    const userId = "anonymous"; 
    auditTrail.logAnalysisDecision(
        userId,
        "prescription_analysis",
        "prescription",
        {
            allergies,
            age,
            conditions,
            isPregnant,
            isBreastfeeding,
            language
        },
        result,
        result.confidenceScore,
        // In a real implementation, we would get the IP address and user agent from the request
        undefined, // ipAddress
        undefined  // userAgent
    );
    
    return result;
};

interface AnalyzeMentalHealthParams {
    audioBlob: Blob;
    language: Language;
}

export const analyzeMentalHealthAudio = async ({ audioBlob, language }: AnalyzeMentalHealthParams): Promise<MentalHealthAnalysisResult> => {
    // Convert Blob to base64 string
    const base64Audio = await blobToBase64(audioBlob);

    // Assuming the Blob is already in 'audio/pcm;rate=16000' or can be processed by the model
    // The createPcmBlob function in utils converts raw Float32Array to PCM Blob.
    // Here we're using a Blob that might come directly from MediaRecorder, often WebM or MP3.
    // For direct PCM, ensure the recording setup yields that format, otherwise the model
    // might expect a more common audio format MIME type.
    const audioPart = {
        inlineData: {
            data: base64Audio,
            mimeType: audioBlob.type, // Use the actual MIME type of the recorded blob
        },
    };

    const textPart = {
        text: `You are a mental health support AI. Analyze the provided audio input from a user.
        
Please perform the following tasks and provide the output in a structured JSON format. **All textual responses within the JSON object should be in ${languageNames[language]}**.

1.  **Transcription**: Transcribe the spoken content accurately.
2.  **Sentiment Analysis**: Determine the overall sentiment or emotional tone (e.g., Neutral, Anxious, Depressed, Hopeful, Calm, Stressed, Angry).
3.  **Crisis Detection**: Identify if the transcription contains language indicating self-harm, suicidal ideation, or severe distress. If a crisis is detected, provide a crisis message offering immediate advice and support.
4.  **Personalized Recommendations**: Based on the sentiment and content, provide 2-3 actionable, general wellness recommendations (e.g., mindfulness exercises, seeking professional help, connecting with loved ones).

Return *only* the JSON object that adheres to the provided schema. Do not include any explanatory text, markdown formatting, or code blocks before or after the JSON.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using gemini-2.5-flash for multimodal text+audio processing
        contents: { parts: [audioPart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: mentalHealthAnalysisSchema,
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as MentalHealthAnalysisResult;
    
    // Log the analysis decision to the audit trail
    // In a real implementation, we would get the actual user ID from the session
    const userId = "anonymous";
    auditTrail.logAnalysisDecision(
        userId,
        "mental_health_analysis",
        "audio",
        { language },
        result,
        result.confidenceScore,
        // In a real implementation, we would get the IP address and user agent from the request
        undefined, // ipAddress
        undefined  // userAgent
    );
    
    return result;
};

export const generateMentalHealthTestContent = async (language: Language): Promise<string> => {
    const prompt = `Generate a short paragraph (around 50-70 words) that expresses a specific sentiment (e.g., neutral, anxious, slightly depressed, or hopeful) suitable for testing a mental health monitoring AI. The text should be in ${languageNames[language]}. Avoid explicit crisis language for this test content unless specifically asked, but allow for nuanced emotional expression.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using gemini-2.5-flash for text generation
        contents: prompt,
        config: {
            temperature: 0.8, // Allow some creativity
        },
    });

    return response.text.trim();
};
