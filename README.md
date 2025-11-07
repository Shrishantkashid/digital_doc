<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1mUvOVcSvoqVn0GDPWxnJMSD4O6EcScwz

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set up MongoDB Atlas:
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster and database named `digital_doctor`
   - Update the `MONGODB_URI` in the [.env](.env) file with your MongoDB Atlas connection string
   - Replace `<username>` and `<password>` with your MongoDB Atlas credentials
4. Run the app:
   `npm run dev`

## Deploy to Vercel

This project includes specific configurations to resolve common deployment issues on Vercel, particularly the Rollup dependency error (`Cannot find module @rollup/rollup-linux-x64-gnu`).

The following files have been configured to ensure successful deployment:

- `vercel.json`: Contains build and routing configurations
- `package.json`: Includes platform-specific build scripts and dependencies
- `vite.config.ts`: Optimized for cross-platform compatibility
- `.vercelignore`: Excludes unnecessary files from deployment
- Post-install script: Ensures correct dependency installation

To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the required environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 3001 (or your preferred port)
4. Deploy!

If you encounter any issues, ensure that the `vercel-build` script is used for building the project.
