"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function GitHubImport() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!repoUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a GitHub repository URL"
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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to import repository');
      }

      toast({
        title: 'Success',
        description: 'Repository imported successfully',
      });
      setRepoUrl('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Import GitHub Repository</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Enter GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleImport} disabled={isLoading}>
          {isLoading ? 'Importing...' : 'Import'}
        </Button>
      </div>
    </div>
  );
}