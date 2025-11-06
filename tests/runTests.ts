// Test runner for prescription validation
import { testFramework } from './PrescriptionValidationTest';

async function runPrescriptionTests() {
  console.log('Starting prescription validation tests...');
  
  try {
    const results = await testFramework.runAllTests();
    const report = testFramework.generateReport();
    
    console.log(report);
    
    // Check if all tests passed
    const allPassed = results.every(result => result.passed);
    
    if (allPassed) {
      console.log('\n✅ All tests passed! The prescription validation system meets the required accuracy.');
    } else {
      console.log('\n❌ Some tests failed. Please review the errors and improve the system.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runPrescriptionTests();
}