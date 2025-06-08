
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function GitHubImport() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const handleImport = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/github/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      toast({
        title: "Success",
        description: "Repository imported successfully",
      });
      setRepoUrl('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import repository",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTestRepo = () => {
    setRepoUrl('https://github.com/octocat/Hello-World');
    setTestMode(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Button onClick={handleImport} disabled={isLoading}>
          {isLoading ? 'Importing...' : 'Import'}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={loadTestRepo}
          disabled={isLoading}
          size="sm"
        >
          Load Test Repository
        </Button>
        {testMode && (
          <span className="text-sm text-muted-foreground flex items-center">
            🧪 Test mode active
          </span>
        )}
      </div>
    </div>
  );
}
