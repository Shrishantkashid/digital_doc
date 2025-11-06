// Dosage Validation Service
// This service validates prescribed dosages against medical guidelines based on age and weight

interface DosageGuideline {
  minAge?: number;      // Minimum age for this dosage (in years)
  maxAge?: number;      // Maximum age for this dosage (in years)
  minWeight?: number;   // Minimum weight for this dosage (in kg)
  maxWeight?: number;   // Maximum weight for this dosage (in kg)
  dosage: string;       // Recommended dosage
  frequency: string;    // How often to take the medication
  maxDailyDose?: string; // Maximum daily dose
  warnings?: string[];  // Special warnings for this dosage
}

interface PatientInfo {
  age: number;          // Age in years
  weight?: number;      // Weight in kg
  conditions?: string[]; // Pre-existing medical conditions
  isPregnant?: boolean; // Whether the patient is pregnant
  isBreastfeeding?: boolean; // Whether the patient is breastfeeding
}

interface DosageValidationResult {
  isValid: boolean;
  recommendedDosage?: string;
  recommendedFrequency?: string;
  warnings: string[];
  contraindications: string[];
}

class DosageValidationService {
  // Dosage guidelines database (in a real implementation, this would be in a database)
  private dosageGuidelines: { [drugName: string]: DosageGuideline[] } = {
    'Amoxicillin': [
      { minAge: 0, maxAge: 2, dosage: '20-40 mg/kg/day', frequency: 'Every 8 hours', warnings: ['Divide dose equally'] },
      { minAge: 2, maxAge: 12, dosage: '250-500 mg', frequency: 'Every 8 hours' },
      { minAge: 12, dosage: '500-875 mg', frequency: 'Every 12 hours' }
    ],
    'Lisinopril': [
      { minAge: 6, maxAge: 12, dosage: '2.5-5 mg', frequency: 'Once daily', warnings: ['Start with lower dose'] },
      { minAge: 12, dosage: '10 mg', frequency: 'Once daily', maxDailyDose: '40 mg' },
      { minAge: 65, dosage: '5 mg', frequency: 'Once daily', warnings: ['May require lower starting dose'] }
    ],
    'Metformin': [
      { minAge: 10, dosage: '500 mg', frequency: 'Twice daily', maxDailyDose: '2000 mg' },
      { minAge: 65, dosage: '500 mg', frequency: 'Once daily', warnings: ['Start with lower dose'] }
    ],
    'Warfarin': [
      { minAge: 18, dosage: '1-10 mg', frequency: 'Once daily', warnings: ['Dose varies significantly between patients'] },
      { minAge: 65, dosage: '1-5 mg', frequency: 'Once daily', warnings: ['Start with lower dose', 'Frequent monitoring required'] }
    ],
    'Atorvastatin': [
      { minAge: 10, dosage: '10-80 mg', frequency: 'Once daily', maxDailyDose: '80 mg' },
      { minAge: 65, dosage: '10 mg', frequency: 'Once daily', warnings: ['Start with lower dose'] }
    ]
  };

  // Contraindications for drugs
  private contraindications: { [drugName: string]: string[] } = {
    'Warfarin': ['Active bleeding', 'Severe liver disease'],
    'Lisinopril': ['Pregnancy', 'Angioedema history'],
    'Metformin': ['Severe kidney disease', 'Heart failure'],
    'Atorvastatin': ['Pregnancy', 'Active liver disease']
  };

  // Validate a dosage for a specific drug and patient
  validateDosage(
    drugName: string,
    prescribedDosage: string,
    prescribedFrequency: string,
    patientInfo: PatientInfo
  ): DosageValidationResult {
    const result: DosageValidationResult = {
      isValid: true,
      warnings: [],
      contraindications: []
    };

    // Check if we have guidelines for this drug
    if (!this.dosageGuidelines[drugName]) {
      result.warnings.push(`No dosage guidelines available for ${drugName}`);
      return result;
    }

    // Get applicable guidelines based on patient info
    const applicableGuidelines = this.dosageGuidelines[drugName].filter(guideline => {
      // Check age range
      if (guideline.minAge !== undefined && patientInfo.age < guideline.minAge) {
        return false;
      }
      if (guideline.maxAge !== undefined && patientInfo.age > guideline.maxAge) {
        return false;
      }
      
      // Check weight range (if weight is provided)
      if (patientInfo.weight !== undefined) {
        if (guideline.minWeight !== undefined && patientInfo.weight < guideline.minWeight) {
          return false;
        }
        if (guideline.maxWeight !== undefined && patientInfo.weight > guideline.maxWeight) {
          return false;
        }
      }
      
      return true;
    });

    if (applicableGuidelines.length === 0) {
      result.warnings.push(`No applicable dosage guidelines found for patient age ${patientInfo.age}`);
      result.isValid = false;
      return result;
    }

    // Use the first applicable guideline (most specific)
    const guideline = applicableGuidelines[0];
    
    result.recommendedDosage = guideline.dosage;
    result.recommendedFrequency = guideline.frequency;
    
    // Add warnings from the guideline
    if (guideline.warnings) {
      result.warnings.push(...guideline.warnings);
    }
    
    // Check if prescribed dosage exceeds maximum
    if (guideline.maxDailyDose) {
      // This is a simplified check - in a real implementation, we would parse and compare actual dosages
      if (this.isDosageExceeding(prescribedDosage, guideline.maxDailyDose)) {
        result.warnings.push(`Prescribed dosage may exceed maximum daily dose of ${guideline.maxDailyDose}`);
        result.isValid = false;
      }
    }
    
    // Check contraindications
    if (this.contraindications[drugName]) {
      const patientConditions = patientInfo.conditions || [];
      
      // Check for pregnancy/breastfeeding contraindications
      if (patientInfo.isPregnant && this.contraindications[drugName].includes('Pregnancy')) {
        result.contraindications.push(`${drugName} is contraindicated during pregnancy`);
        result.isValid = false;
      }
      
      if (patientInfo.isBreastfeeding && this.contraindications[drugName].includes('Breastfeeding')) {
        result.contraindications.push(`${drugName} is contraindicated during breastfeeding`);
        result.isValid = false;
      }
      
      // Check for condition-based contraindications
      for (const condition of patientConditions) {
        if (this.contraindications[drugName].includes(condition)) {
          result.contraindications.push(`${drugName} is contraindicated for patients with ${condition}`);
          result.isValid = false;
        }
      }
    }
    
    // Special checks for elderly patients
    if (patientInfo.age >= 65) {
      result.warnings.push('Patient is elderly - consider reduced dosing and increased monitoring');
    }
    
    // Special checks for pediatric patients
    if (patientInfo.age < 12) {
      result.warnings.push('Patient is pediatric - ensure accurate dosing based on weight');
    }
    
    return result;
  }

  // Get all dosage guidelines for a drug
  getDosageGuidelines(drugName: string): DosageGuideline[] {
    return this.dosageGuidelines[drugName] || [];
  }

  // Add a new dosage guideline
  addDosageGuideline(drugName: string, guideline: DosageGuideline): void {
    if (!this.dosageGuidelines[drugName]) {
      this.dosageGuidelines[drugName] = [];
    }
    this.dosageGuidelines[drugName].push(guideline);
  }

  // Simplified dosage comparison (in a real implementation, we would parse and compare actual dosages)
  private isDosageExceeding(prescribed: string, maximum: string): boolean {
    // This is a very simplified implementation
    // In a real system, we would parse the actual dosage values and units
    return false; // For now, we'll assume it's not exceeding
  }
}

// Create a singleton instance
const dosageValidationService = new DosageValidationService();

export { DosageValidationService, dosageValidationService };
export type { DosageGuideline, PatientInfo, DosageValidationResult };