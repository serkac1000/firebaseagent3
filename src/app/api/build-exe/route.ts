
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, chmod } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

async function createAndroidStudioProject(projectDir: string, pythonFileName: string) {
  const projectName = pythonFileName.replace('.py', '').replace(/[^a-zA-Z0-9]/g, '');
  
  // Create project structure
  await mkdir(projectDir, { recursive: true });
  await mkdir(path.join(projectDir, 'app', 'src', 'main', 'java', 'com', 'example', projectName.toLowerCase()), { recursive: true });
  await mkdir(path.join(projectDir, 'app', 'src', 'main', 'res', 'values'), { recursive: true });
  await mkdir(path.join(projectDir, 'app', 'src', 'main', 'res', 'layout'), { recursive: true });
  await mkdir(path.join(projectDir, 'app', 'src', 'main', 'assets'), { recursive: true });
  
  // Create buildozer.spec for Kivy
  const buildozerSpec = `[app]
title = ${projectName}
package.name = ${projectName.toLowerCase()}
package.domain = com.example

source.dir = .
source.include_exts = py,png,jpg,kv,atlas

version = 0.1
requirements = python3,kivy

[buildozer]
log_level = 2

[app]
android.permissions = INTERNET

# Android specific
android.api = 30
android.minapi = 21
android.sdk = 30
android.ndk = 25b
android.gradle_dependencies = 

[app]
fullscreen = 0
`;

  await writeFile(path.join(projectDir, 'buildozer.spec'), buildozerSpec);

  // Create main.py template for Kivy
  const kivyTemplate = `from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button

class ${projectName}App(App):
    def build(self):
        layout = BoxLayout(orientation='vertical')
        
        label = Label(text='Hello from ${projectName}!', 
                     size_hint=(1, 0.5))
        
        button = Button(text='Click me!', 
                       size_hint=(1, 0.5))
        button.bind(on_press=self.on_button_click)
        
        layout.add_widget(label)
        layout.add_widget(button)
        
        return layout
    
    def on_button_click(self, instance):
        instance.text = 'Button clicked!'

if __name__ == '__main__':
    ${projectName}App().run()
`;

  await writeFile(path.join(projectDir, 'main.py'), kivyTemplate);

  // Create Android project files
  const buildGradle = `apply plugin: 'com.android.application'

android {
    compileSdkVersion 30
    buildToolsVersion "30.0.3"

    defaultConfig {
        applicationId "com.example.${projectName.toLowerCase()}"
        minSdkVersion 21
        targetSdkVersion 30
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.3.1'
}
`;

  await writeFile(path.join(projectDir, 'app', 'build.gradle'), buildGradle);

  // Create AndroidManifest.xml
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.${projectName.toLowerCase()}">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <activity android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;

  await writeFile(path.join(projectDir, 'app', 'src', 'main', 'AndroidManifest.xml'), androidManifest);

  // Create strings.xml
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${projectName}</string>
</resources>
`;

  await writeFile(path.join(projectDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml'), stringsXml);

  // Create README for Android development
  const androidReadme = `# ${projectName} Android Project

This project structure is prepared for Android development using Python.

## Setup Instructions:

### For Kivy (Python-based Android apps):
1. Install Buildozer: \`pip install buildozer\`
2. Install Android SDK and NDK
3. Run: \`buildozer android debug\`

### For Android Studio:
1. Open Android Studio
2. Import this project
3. Configure your Python integration using Chaquopy or similar
4. Build and run on device/emulator

## Files included:
- buildozer.spec: Configuration for Kivy/Buildozer
- main.py: Sample Kivy application
- Android project structure for native development
- AndroidManifest.xml with necessary permissions

## Next Steps:
1. Modify main.py with your application logic
2. Configure buildozer.spec for your requirements
3. Build using: \`buildozer android debug\`
4. Test on Android device or emulator
`;

  await writeFile(path.join(projectDir, 'README.md'), androidReadme);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      return NextResponse.json({ error: 'File and fileName are required' }, { status: 400 });
    }

    // Create temp directory for processing
    const tempDir = path.join(process.cwd(), 'temp', Date.now().toString());
    await mkdir(tempDir, { recursive: true });

    // Save uploaded file
    const filePath = path.join(tempDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    await chmod(filePath, 0o755);

    // Build exe with PyInstaller
    const outputDir = path.join(tempDir, 'dist');
    const command = `cd ${tempDir} && python -m PyInstaller --onefile --distpath dist "${fileName}"`;
    
    console.log('Executing PyInstaller command:', command);
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 300000, // 5 minutes timeout
      env: {
        ...process.env,
        PYTHONPATH: process.env.PYTHONPATH || '',
      }
    });

    console.log('PyInstaller stdout:', stdout);
    if (stderr) console.log('PyInstaller stderr:', stderr);

    // Check if exe was created
    const exeName = fileName.replace('.py', '.exe');
    const exePath = path.join(outputDir, exeName);
    
    if (!existsSync(exePath)) {
      throw new Error('Executable file was not created. Check your Python code for errors.');
    }

    // Create Android Studio project structure
    const androidProjectDir = path.join(tempDir, 'android_project');
    await createAndroidStudioProject(androidProjectDir, fileName);

    return NextResponse.json({
      success: true,
      message: 'Executable and Android project built successfully',
      outputPath: exePath,
      androidProjectPath: androidProjectDir,
      logs: stdout
    });

  } catch (error: any) {
    console.error('Build error:', error);
    return NextResponse.json({
      error: 'Failed to build executable',
      details: error.message,
      logs: error.stderr || ''
    }, { status: 500 });
  }
}
