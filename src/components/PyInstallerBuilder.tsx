
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export function PyInstallerBuilder() {
  const [file, setFile] = useState<File | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Python to Executable Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            accept=".py"
            onChange={handleFileChange}
            className="mb-2"
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

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
                <p className="text-sm">Output: {result.outputPath}</p>
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
