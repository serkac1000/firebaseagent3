
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export function GitHubImport() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
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
  );
}
