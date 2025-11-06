// Configuration for prescription validation tests

interface TestConfig {
  // Minimum accuracy required for tests to pass
  minimumAccuracy: number;
  
  // Number of test cases to run
  testCount: number;
  
  // Database connections for validation
  drugDatabase: {
    drugBankApiKey?: string;
    fdaApiKey?: string;
  };
  
  // Test data directory
  testDataDir: string;
  
  // Output directory for test reports
  outputDir: string;
}

const config: TestConfig = {
  minimumAccuracy: 95,
  testCount: 1000,
  drugDatabase: {
    drugBankApiKey: process.env.DRUGBANK_API_KEY,
    fdaApiKey: process.env.FDA_API_KEY
  },
  testDataDir: './tests/prescription-tests',
  outputDir: './tests/reports'
};

export default config;
export type { TestConfig };