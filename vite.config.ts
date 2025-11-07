import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'VITE_');
    return {
      build: {
        rollupOptions: {
          external: [],
          output: {
            manualChunks: undefined
          }
        },
        sourcemap: true,
        // Add this to handle platform-specific builds
        target: 'es2020',
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
        strictPort: true
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
      // Ensure proper handling of modules
      optimizeDeps: {
        include: ['react', 'react-dom', '@google/genai']
      }
    };
});