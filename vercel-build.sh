#!/bin/bash
# Vercel build script

echo "Setting environment variables"
export ROLLUP_DISABLE_LOAD_RUST_ON_DEMAND=1

echo "Installing dependencies"
npm install

echo "Running vite build"
vite build