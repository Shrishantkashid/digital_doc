const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing user registration...');
    
    // Test user registration
    const registerResponse = await axios.post('http://localhost:3001/api/auth/register', {
      username: 'testuser' + Date.now(),
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

testAuth();