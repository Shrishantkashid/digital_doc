const axios = require('axios');

async function testAPI() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('Health check:', healthResponse.data);
    
    // Test user registration
    console.log('\nTesting user registration...');
    const registerResponse = await axios.post('http://localhost:3001/api/auth/register', {
      username: 'testuser',
      password: 'testpass123',
      email: 'test@example.com'
    });
    console.log('Registration response:', registerResponse.data);
    
    // Test user login
    console.log('\nTesting user login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'testuser',
      password: 'testpass123'
    });
    console.log('Login response:', loginResponse.data);
    
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testAPI();