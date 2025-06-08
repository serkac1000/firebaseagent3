# Firebase Studio - CodePilot

This is a NextJS starter, named CodePilot, in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Getting Started with CodePilot on Windows

These steps will guide you through setting up and running the CodePilot application on your Windows machine after you have cloned the repository.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Make sure you have Node.js installed, which includes npm (Node Package Manager). You can download it from [nodejs.org](https://nodejs.org/).
*   **Git**: You'll need Git to clone the repository and manage versions. You can download it from [git-scm.com](https://git-scm.com/).

### Installation and Setup Steps

1.  **Clone the repository:**
    If you haven't already, clone the repository to your local machine using Git. Open your command prompt (cmd) or PowerShell and run:
    ```bash
    git clone <repository_url>
    ```
    (Replace `<repository_url>` with the actual URL of the repository).

2.  **Navigate to the project directory:**
    Change your current directory to the newly cloned project folder:
    ```bash
    cd <project_directory_name>
    ```
    (Replace `<project_directory_name>` with the name of the folder created by `git clone`, usually the repository name).

3.  **Install dependencies:**
    Install the necessary project dependencies using npm:
    ```bash
    npm install
    ```
    This command will download all the packages listed in the `package.json` file.

4.  **Set up Environment Variables (Important for AI Features):**
    The application uses an API key for Gemini AI services.
    *   Create a new file named `.env.local` in the root of your project directory (the same level as `package.json`).
    *   Add your Google Gemini API key to this file:
        ```env
        GOOGLE_API_KEY=your_actual_gemini_api_key_here
        # You might also want to set NEXT_PUBLIC_GOOGLE_API_KEY if any client-side Genkit usage is planned
        # NEXT_PUBLIC_GOOGLE_API_KEY=your_actual_gemini_api_key_here
        ```
    *   Replace `your_actual_gemini_api_key_here` with your valid API key.
    *   **Note:** The `ApiKeyModal` in the app mentions that the `GOOGLE_API_KEY` environment variable is crucial for server-side AI operations.

5.  **Run the development server:**
    Start the Next.js development server:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002` (as configured in your `package.json`). Open this URL in your web browser to see CodePilot running.

### Other Useful Commands

*   **Run Genkit development server (for AI flows):**
    ```bash
    npm run genkit:dev
    ```
*   **Build for production:**
    ```bash
    npm run build
    ```
*   **Start production server:**
    ```bash
    npm run start
    ```
*   **Lint code:**
    ```bash
    npm run lint
    ```
*   **Type check:**
    ```bash
    npm run typecheck
    ```

# Firebase Studio - CodePilot

## Android Studio Project Creation & APK Compilation

This application includes a PyInstaller Builder that not only creates Windows executables but also generates complete Android Studio project structure for mobile app development.

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

# firebaseagent3
