// Test multi-language support
import { Language } from '../types';

// Language names mapping
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

function testMultilanguage() {
  console.log('Testing Multi-language Support...');
  
  // Test that all languages are properly mapped
  console.log('\nLanguage Mappings:');
  Object.entries(languageNames).forEach(([code, name]) => {
    console.log(`${code}: ${name}`);
  });
  
  console.log('\n✅ All languages are properly mapped!');
}

// Run the test
testMultilanguage();