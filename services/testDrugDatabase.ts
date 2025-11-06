// Test the drug database service
import { drugDatabaseService } from './DrugDatabaseService';

async function testDrugDatabase() {
  console.log('Testing Drug Database Service...');
  
  try {
    // Test getting drug information
    console.log('\n1. Testing drug information retrieval...');
    const drugInfo = await drugDatabaseService.getDrugInfo('Lipitor');
    console.log('Drug Info for Lipitor:', drugInfo);
    
    // Test getting generic alternatives
    console.log('\n2. Testing generic alternatives...');
    const generics = await drugDatabaseService.getGenericAlternatives('Lipitor');
    console.log('Generic alternatives for Lipitor:', generics);
    
    // Test getting nearby pharmacies
    console.log('\n3. Testing nearby pharmacies...');
    const pharmacies = await drugDatabaseService.getNearbyPharmacies('Lipitor');
    console.log('Nearby pharmacies:', pharmacies);
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testDrugDatabase();