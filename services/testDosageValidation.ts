// Test the dosage validation service
import { dosageValidationService, type PatientInfo } from './DosageValidationService';

function testDosageValidation() {
  console.log('Testing Dosage Validation Service...');
  
  try {
    // Test 1: Valid adult dosage
    console.log('\n1. Testing valid adult dosage...');
    const patient1: PatientInfo = { age: 45, weight: 70 };
    const result1 = dosageValidationService.validateDosage('Lisinopril', '10 mg', 'Once daily', patient1);
    console.log('Lisinopril for 45-year-old:', result1);
    
    // Test 2: Elderly patient
    console.log('\n2. Testing elderly patient...');
    const patient2: PatientInfo = { age: 75, weight: 65, conditions: ['Hypertension'] };
    const result2 = dosageValidationService.validateDosage('Lisinopril', '10 mg', 'Once daily', patient2);
    console.log('Lisinopril for 75-year-old:', result2);
    
    // Test 3: Pediatric patient
    console.log('\n3. Testing pediatric patient...');
    const patient3: PatientInfo = { age: 8, weight: 25 };
    const result3 = dosageValidationService.validateDosage('Amoxicillin', '250 mg', 'Every 8 hours', patient3);
    console.log('Amoxicillin for 8-year-old:', result3);
    
    // Test 4: Pregnant patient with contraindicated drug
    console.log('\n4. Testing pregnant patient with contraindicated drug...');
    const patient4: PatientInfo = { age: 30, isPregnant: true };
    const result4 = dosageValidationService.validateDosage('Lisinopril', '10 mg', 'Once daily', patient4);
    console.log('Lisinopril for pregnant patient:', result4);
    
    // Test 5: Patient with contraindicated condition
    console.log('\n5. Testing patient with contraindicated condition...');
    const patient5: PatientInfo = { age: 50, conditions: ['Severe kidney disease'] };
    const result5 = dosageValidationService.validateDosage('Metformin', '500 mg', 'Twice daily', patient5);
    console.log('Metformin for patient with kidney disease:', result5);
    
    // Test 6: Non-existent drug
    console.log('\n6. Testing non-existent drug...');
    const patient6: PatientInfo = { age: 35 };
    const result6 = dosageValidationService.validateDosage('NonExistentDrug', '10 mg', 'Once daily', patient6);
    console.log('NonExistentDrug for 35-year-old:', result6);
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testDosageValidation();