# Vercel Deployment Fix

This document explains the changes made to fix the Rollup dependency error when deploying to Vercel:

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

## Changes Made

### 1. Added vercel.json configuration
- Configured build and routing for both frontend and backend
- Added memory allocation settings
- Specified install and build commands

### 2. Updated package.json
- Downgraded Vite to version 4.5.0 to avoid Rollup native module issues
- Added @rollup/rollup-linux-x64-gnu as a dev dependency
- Added `vercel-build` script that ensures proper installation
- Added Node.js engine specification

### 3. Created .vercelignore
- Excluded unnecessary files and directories from deployment
- Reduced deployment size and improved build times

### 4. Enhanced vite.config.ts
- Added build target specification
- Improved cross-platform compatibility
- Added Rollup environment configuration

### 5. Added .npmrc configuration
- Configured npm to handle platform-specific dependencies correctly
- Disabled Rollup's native bindings

### 6. Added vercel-build.sh script
- Created a shell script to ensure proper environment setup
- Explicitly sets Rollup environment variables
- Forces dependency installation before build

## How It Works

The main issue was that Rollup's platform-specific optional dependencies weren't being installed correctly on Vercel's Linux build environment. The solution involves:

1. Downgrading Vite to avoid the problematic Rollup version
2. Explicitly installing the required Rollup dependency
3. Setting environment variables to disable Rollup's native bindings
4. Configuring npm to handle platform-specific dependencies correctly
5. Using a custom build script that ensures proper setup

## Deployment Instructions

1. Commit all changes to your repository
2. Connect your repository to Vercel
3. In Vercel project settings, set environment variables:
   - `VITE_GEMINI_API_KEY` - Your Gemini API key
   - `MONGODB_URI` - Your MongoDB connection string
4. Deploy the project

The build should now complete successfully without the Rollup module error.