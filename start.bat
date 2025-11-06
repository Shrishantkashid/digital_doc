@echo on
REM Digital Doctor - Start Script for Windows

echo Starting Digital Doctor...
echo.

echo Current directory: %cd%
echo.

echo Current time: %time%
echo.

REM Check if we're in the correct directory
if not exist "package.json" (
    echo Error: package.json not found!
    echo Please run this script from the digital_doctor project directory.
    pause
    exit /b 1
)

echo Found package.json. Continuing...
echo.

REM Check if Node.js is installed
node --version
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.

REM Check if npm is installed
npm --version
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH.
    echo This usually comes with Node.js installation.
    pause
    exit /b 1
)

echo.

echo Node.js and npm are installed. Continuing...
echo.

REM Check for .env.local file
if not exist ".env.local" (
    echo ERROR: .env.local file not found!
    echo This file is required to run the application.
    echo Please create a .env.local file with your GEMINI_API_KEY.
    echo A template has been provided as .env.example.
    echo Copy it: copy .env.example .env.local
    echo Then edit .env.local with your actual API key.
    pause
    exit /b 1
) else (
    echo .env.local file found. Checking for API key...
    findstr /C:"GEMINI_API_KEY" .env.local >nul
    if %errorlevel% neq 0 (
        echo ERROR: GEMINI_API_KEY not found in .env.local file!
        echo The file exists but doesn't contain the required GEMINI_API_KEY variable.
        echo Please add GEMINI_API_KEY=your_key_here to the .env.local file.
        pause
        exit /b 1
    ) else (
        echo GEMINI_API_KEY found in .env.local file.
        echo.
        REM Verify the API key is not the placeholder
        findstr "your_api_key_here" .env.local >nul
        if %errorlevel% equ 0 (
            echo ERROR: GEMINI_API_KEY still has placeholder value!
            echo Please replace 'your_api_key_here' with your actual API key from https://makersuite.google.com/
            pause
            exit /b 1
        )
    )
)

REM Check for .env file (for MongoDB Atlas)
if not exist ".env" (
    echo WARNING: .env file not found!
    echo This file is required for MongoDB Atlas connection.
    echo Please create a .env file with your MongoDB Atlas connection string.
    echo Refer to MONGODB_ATLAS_SETUP.md for instructions.
    echo.
) else (
    echo .env file found. Checking for MongoDB URI...
    findstr /C:"MONGODB_URI" .env >nul
    if %errorlevel% neq 0 (
        echo WARNING: MONGODB_URI not found in .env file!
        echo The file exists but doesn't contain the required MONGODB_URI variable.
        echo Refer to MONGODB_ATLAS_SETUP.md for instructions.
        echo.
    ) else (
        echo MONGODB_URI found in .env file.
        echo.
        REM Verify the URI is not the placeholder
        findstr "example.mongodb.net" .env >nul
        if %errorlevel% equ 0 (
            echo WARNING: MONGODB_URI still has placeholder value!
            echo Please update the connection string in .env with your MongoDB Atlas credentials.
            echo Refer to MONGODB_ATLAS_SETUP.md for instructions.
            echo.
        )
    )
    )
)

echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies
        echo Possible solutions:
        echo 1. Check your internet connection
        echo 2. Clear npm cache: npm cache clean --force
        echo 3. Try again
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
)

echo.
echo All dependencies are installed.
echo.

REM Check if port 3000 is available
echo Checking if port 3000 is available...
tasklist /svc /fi "IMAGENAME eq node.exe" | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo.
    echo WARNING: Port 3000 appears to be in use!
    echo You may need to stop another server running on this port.
    echo To stop all Node.js processes, run: taskkill /f /im node.exe
    echo.
)

echo.
echo Preparing to start the development server...
echo.
echo Make sure you have your GEMINI_API_KEY in .env.local file
necho Application will be available at: http://localhost:3000
necho Press Ctrl+C to stop the server
necho.

echo Starting Vite development server...
echo.

REM Use direct vite command with inline port specification
cmd /c "set PORT=3000 && npm run dev"

if %errorlevel% equ 0 (
    echo.
    echo Development server stopped normally.
) else (
    echo.
    echo ERROR: Development server failed to start!
    echo Common causes:
    echo 1. Port 3000 is already in use
    echo 2. Missing or invalid GEMINI_API_KEY
    echo 3. Missing dependencies (try: npm install)
    echo 4. Corrupted node_modules (try: delete node_modules and package-lock.json, then npm install)
)

echo.
echo When ready, press any key to close this window...
set/p =<nul
pause >nul