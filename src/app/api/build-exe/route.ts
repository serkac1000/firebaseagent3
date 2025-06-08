
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, chmod } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

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

    return NextResponse.json({
      success: true,
      message: 'Executable built successfully',
      outputPath: exePath,
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
