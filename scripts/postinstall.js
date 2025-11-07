#!/usr/bin/env node

// This script ensures that platform-specific dependencies are correctly installed
// for Vercel deployments

import { execSync } from 'child_process';
import os from 'os';

console.log('Running postinstall script...');
console.log('Platform:', os.platform());
console.log('Architecture:', os.arch());

try {
  // For Vercel/Linux environments, ensure we have the correct Rollup binary
  if (process.env.VERCEL || os.platform() === 'linux') {
    console.log('Installing/Rebuilding for Linux platform...');
    execSync('npm rebuild --platform=linux --optional', { stdio: 'inherit' });
  }
} catch (error) {
  console.warn('Warning: Could not rebuild for Linux platform:', error.message);
  console.log('Continuing with default installation...');
}