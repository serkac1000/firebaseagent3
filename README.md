
# Firebase Studio - CodePilot

A comprehensive AI-powered development platform with GitHub integration, PyInstaller Builder, and Android app generation capabilities.

## Features

- 🤖 AI-powered code generation using Google Gemini
- 🐙 GitHub repository import/export with @octokit/rest
- 📦 PyInstaller Builder for creating Windows executables
- 📱 Android Studio project generation
- 🔧 Complete development environment
- 🎨 Modern UI with Radix UI components

## Installation and Setup

### 1. Clone the repository
```bash
git clone <repository_url>
cd <project_directory>
```

### 2. Install dependencies (including @octokit/rest)
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env.local` file in the root directory:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
GITHUB_PAT=your_github_personal_access_token_here
```

### 4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## GitHub Integration

This project includes full GitHub integration using `@octokit/rest`:

- **Import repositories**: Fetch code from any public GitHub repository
- **Export to GitHub**: Push your generated code to GitHub repositories
- **API integration**: Complete GitHub API support with authentication

## PyInstaller Builder

Generate Windows executables from Python code:
1. Upload Python files through the web interface
2. Configure build options
3. Download the generated .exe file
4. Optionally generate Android project structure

## Android Studio Project Creation & APK Compilation

### Steps to Create and Compile Android APK:

#### 1. Generate Android Project Structure
1. Navigate to the PyInstaller Builder in the web interface
2. Upload your Python (.py) file
3. Click "Build Executable" - this creates both the Windows executable and Android project structure
4. The system will generate:
   - Complete Android Studio project in `android_project/` directory
   - `buildozer.spec` configuration file for Kivy/Buildozer compilation
   - `main.py` template adapted for Kivy mobile development
   - Android manifest files and project structure

#### 2. Prepare for Android Development

**Option A: Using Buildozer (Recommended for Python/Kivy apps)**
```bash
# Install required dependencies
pip install buildozer
pip install kivy
pip install cython

# Navigate to the generated android project directory
cd temp/[timestamp]/android_project/

# Initialize and build APK
buildozer android debug
```

**Option B: Using Android Studio (For native Android development)**
1. Download and install Android Studio
2. Install Android SDK (API level 30 recommended)
3. Install Android NDK (version 25b recommended)
4. Open the generated `android_project` folder in Android Studio
5. Sync Gradle files
6. Build APK via Build → Build Bundle(s)/APK(s) → Build APK(s)

#### 3. Project Structure Generated
```
android_project/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/[projectname]/
│   │   ├── res/
│   │   │   ├── values/strings.xml
│   │   │   └── layout/
│   │   ├── assets/
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── buildozer.spec
├── main.py (Kivy template)
└── README.md
```

#### 4. Configuration Files Included

**buildozer.spec** - Pre-configured for:
- Target Android API 30
- Minimum API 21
- Required permissions (INTERNET)
- Python 3 + Kivy requirements

**AndroidManifest.xml** - Includes:
- App permissions
- Activity declarations
- Launch configurations

#### 5. Testing Your APK
1. **Debug APK**: `buildozer android debug` creates an unsigned APK for testing
2. **Release APK**: `buildozer android release` creates a signed APK for distribution
3. **Install on device**: `adb install bin/[appname]-debug.apk`

#### 6. Troubleshooting Common Issues
- **NDK not found**: Ensure Android NDK is installed via Android Studio SDK Manager
- **Build tools missing**: Install Android SDK Build-Tools via SDK Manager
- **Java version issues**: Use Java 8 or 11 for compatibility
- **Gradle sync failed**: Check network connectivity and proxy settings

#### 7. Advanced Configuration
To customize your Android app:
1. Edit `buildozer.spec` for app metadata, permissions, and requirements
2. Modify `main.py` with your application logic using Kivy framework
3. Add resources to `app/src/main/assets/` directory
4. Update `AndroidManifest.xml` for additional permissions or features

### Prerequisites for Android Development
- Python 3.7+
- Android Studio with SDK Tools
- Android NDK (for native compilation)
- Java 8 or 11
- At least 8GB RAM recommended
- 10GB+ free disk space

## Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server for AI flows

## Dependencies

### Main Dependencies
- **Next.js 15.2.3** - React framework
- **@octokit/rest** - GitHub API integration
- **@genkit-ai/googleai** - Google Gemini AI integration
- **Radix UI** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend services
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Key Features by Component
- **GitHubImport.tsx**: Repository import functionality
- **PyInstallerBuilder.tsx**: Executable generation
- **CodePilotLayout.tsx**: Main application layout with GitHub push capabilities
- **API Routes**: GitHub integration and build services

## GitHub Upload

To upload all files to GitHub:

```bash
# Make the upload script executable
chmod +x update_to_github.sh

# Run the upload script
./update_to_github.sh
```

This will:
1. Install all dependencies including @octokit/rest
2. Add all project files to Git
3. Create a comprehensive commit
4. Push to your configured GitHub repository

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   ├── GitHubImport.tsx
│   │   └── PyInstallerBuilder.tsx
│   └── lib/               # Utilities
├── test-files/            # Sample test files
├── package.json           # Dependencies including @octokit/rest
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Install dependencies: `npm install`
5. Test your changes: `npm run dev`
6. Commit and push to your branch
7. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
