# Running the Digital Doctor Project

This document explains how to run the Digital Doctor platform.

## Prerequisites

1. Node.js (version 20.19.0 or >=22.12.0 recommended)
2. npm (comes with Node.js)

## Installation

1. Navigate to the project directory:
   ```
   cd c:\Users\SHRI\Desktop\digital_doctor
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Project

### Option 1: Using Vite Development Server (Recommended)

1. Start the development server:
   ```
   npm run dev
   ```

2. Access the application at http://localhost:3000

### Option 2: Build and Preview

1. Build the project:
   ```
   npm run build
   ```

2. Preview the built application:
   ```
   npm run preview
   ```

### Option 3: Simple Test Server

If the Vite server doesn't work, you can use the simple test server:

1. Run the simple server:
   ```
   node simple-server.cjs
   ```

2. Access the test page at http://localhost:3001

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 3000 is already in use, the server will fail to start. Either stop the process using port 3000 or change the port in the configuration.

2. **Missing dependencies**: If you encounter errors about missing modules, try running:
   ```
   npm install
   ```

3. **ES Module issues**: If you see errors about `require` not being defined, make sure you're using the correct file extensions (.cjs for CommonJS, .js for ES modules).

### Dependency Issues

If you encounter issues with dependencies, try reinstalling them:
```
npm install react react-dom @google/genai @vitejs/plugin-react vite typescript @types/node
```

## Environment Variables

To use the AI features and database functionality, you need to set up a `.env` file in the project root with your credentials:

1. For AI features, add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

2. For MongoDB Atlas database:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/digital_doctor?retryWrites=true&w=majority
```

Refer to [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) for detailed instructions on setting up MongoDB Atlas.

## Testing the Implementation

The project includes several test files to verify the implementation:

1. `audit/testAuditTrail.ts` - Tests the audit trail system
2. `services/testDrugDatabase.ts` - Tests the drug database integration
3. `services/testDosageValidation.ts` - Tests the dosage validation service
4. `tests/runTests.ts` - Runs the prescription validation tests

To run the tests:
```
npx ts-node audit/testAuditTrail.ts
npx ts-node services/testDrugDatabase.ts
npx ts-node services/testDosageValidation.ts
npx ts-node tests/runTests.ts
```

## Features Implemented

1. **Enhanced Confidence Scoring**: Numerical confidence scores (0-100) for all AI analyses
2. **Clinical Testing Framework**: Comprehensive testing framework for prescription validation
3. **Audit Trail System**: Complete logging for regulatory compliance
4. **Real-time Drug Database Integration**: Integration with drug databases for pricing and availability
5. **Advanced Dosage Validation**: Age, weight, and condition-based dosage validation
6. **Multi-language Support**: Support for 10 Indian languages

## Next Steps

With the core platform running, you can now:
1. Test the prescription analysis features
2. Verify the mental health monitoring capabilities
3. Run the clinical validation tests
4. Continue implementing the next phases of the PRD