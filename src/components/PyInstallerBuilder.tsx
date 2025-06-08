
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export function PyInstallerBuilder() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('generate');

  const generatePythonCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate Python code');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCode('');

    try {
      const response = await fetch('/api/generate-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCode(data.pythonCode);
        // Create a virtual file from generated code
        const blob = new Blob([data.pythonCode], { type: 'text/python' });
        const virtualFile = new File([blob], data.filename, { type: 'text/python' });
        setFile(virtualFile);
        setError('');
      } else {
        setError(data.error + (data.details ? `: ${data.details}` : ''));
      }
    } catch (err: any) {
      setError(`Failed to generate Python code: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.py')) {
      setFile(selectedFile);
      setError('');
      setResult(null);
    } else {
      setError('Please select a Python (.py) file');
    }
  };

  const buildExecutable = async () => {
    if (!file) {
      setError('Please select a Python file first');
      return;
    }

    setIsBuilding(true);
    setBuildProgress(0);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setBuildProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      const response = await fetch('/api/build-exe', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setBuildProgress(100);

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error + (data.details ? `: ${data.details}` : ''));
      }
    } catch (err: any) {
      setError(`Build failed: ${err.message}`);
    } finally {
      setIsBuilding(false);
      setTimeout(() => setBuildProgress(0), 2000);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Python to Executable & Android Project Creator</CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate Python code from prompts or upload files, then create executables and Android Studio projects
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Selection */}
        <div className="flex space-x-2 mb-4">
          <Button 
            variant={activeTab === 'generate' ? 'default' : 'outline'}
            onClick={() => setActiveTab('generate')}
            className="flex-1"
          >
            Generate from Prompt
          </Button>
          <Button 
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
            className="flex-1"
          >
            Upload Python File
          </Button>
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Describe your Android app idea:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a simple calculator app with basic math operations, or Create a weather app that shows current temperature"
                className="w-full p-3 border rounded-md min-h-[100px] resize-vertical"
              />
            </div>
            
            <Button 
              onClick={generatePythonCode} 
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating Python Code...' : 'Generate Python Code for Android'}
            </Button>

            {generatedCode && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Generated Python Code:</label>
                <textarea
                  value={generatedCode}
                  onChange={(e) => {
                    setGeneratedCode(e.target.value);
                    // Update the virtual file when code is edited
                    const blob = new Blob([e.target.value], { type: 'text/python' });
                    const virtualFile = new File([blob], file?.name || 'generated_app.py', { type: 'text/python' });
                    setFile(virtualFile);
                  }}
                  className="w-full p-3 border rounded-md font-mono text-sm"
                  rows={15}
                />
                <p className="text-xs text-muted-foreground">
                  You can edit the generated code above before building
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div>
            <Input
              type="file"
              accept=".py"
              onChange={handleFileChange}
              className="mb-2"
            />
            {file && !generatedCode && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
        )}

        {file && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-800 font-medium">
              ✓ Python file ready: {file.name}
            </p>
          </div>
        )}

        <Button 
          onClick={buildExecutable} 
          disabled={!file || isBuilding}
          className="w-full"
        >
          {isBuilding ? 'Building Executable...' : 'Build Executable'}
        </Button>

        {isBuilding && buildProgress > 0 && (
          <div className="space-y-2">
            <Progress value={buildProgress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Building... {buildProgress}%
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-green-600">✅ {result.message}</p>
                <p className="text-sm">Executable: {result.outputPath}</p>
                {result.androidProjectPath && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-800">📱 Android Studio Project Created</p>
                    <p className="text-xs text-blue-600">Path: {result.androidProjectPath}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Ready for Kivy/Buildozer compilation to APK
                    </p>
                  </div>
                )}
                {result.logs && (
                  <details className="text-xs">
                    <summary>Build Logs</summary>
                    <pre className="mt-2 bg-muted p-2 rounded overflow-auto max-h-40">
                      {result.logs}
                    </pre>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
