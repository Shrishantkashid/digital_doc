// Test the audit trail system
import { auditTrail } from './AuditTrail';

// Simulate some audit entries
auditTrail.logAnalysisDecision(
  "user123",
  "prescription_analysis",
  "prescription",
  { allergies: "penicillin", age: "65", conditions: "hypertension" },
  { 
    analysisConfidence: "High",
    confidenceScore: 95,
    confidenceReasoning: "Clear image",
    medications: [{ name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }],
    interactions: [],
    allergyAlerts: [],
    enhancedSafetyAlerts: [],
    costOptimization: []
  },
  95,
  "192.168.1.100",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
);

auditTrail.logAnalysisDecision(
  "user456",
  "mental_health_analysis",
  "audio",
  { language: "en" },
  {
    transcription: "I've been feeling really anxious lately.",
    sentiment: "Anxious",
    confidenceScore: 87,
    crisisDetected: false,
    recommendations: ["Try deep breathing exercises", "Consider talking to a counselor"]
  },
  87,
  "192.168.1.101",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
);

// Generate and display a compliance report
console.log(auditTrail.generateComplianceReport());

// Export to JSON
console.log("\nJSON Export:");
console.log(auditTrail.exportToJson());

// Export to CSV
console.log("\nCSV Export:");
console.log(auditTrail.exportToCsv());

// Test filtering
console.log("\nFiltered Entries (High Confidence > 90):");
const highConfidenceEntries = auditTrail.getAuditEntries({ minConfidence: 90 });
console.log(highConfidenceEntries);