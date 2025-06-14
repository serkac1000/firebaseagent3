"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ApiKeyModal } from './ApiKeyModal';

import { 
  Copy, 
  Download, 
  Github, 
  Loader2, 
  Settings, 
  Upload, 
  Cpu, 
  Code,
  FileText,
  Zap,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { generateCode, type GenerateCodeInput } from "@/ai/flows/generate-code-from-prompt";
import { useToast } from "@/hooks/use-toast";

export function CodePilotLayout() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [uploadedFilesContent, setUploadedFilesContent] = useState<string[]>([]);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [githubCommitMessage, setGithubCommitMessage] = useState("feat: Add generated code");
  const [githubPat, setGithubPat] = useState("");

  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsLoading(true);
      try {
        const contentsArray: string[] = [];
        const namesArray: string[] = [];
        for (const file of Array.from(files)) {
          namesArray.push(file.name);
          const text = await file.text();
          contentsArray.push(`File: ${file.name}\n\n${text}`);
        }
        setUploadedFilesContent(contentsArray);
        setUploadedFileNames(namesArray);
        toast({ title: "Files Uploaded", description: `${files.length} file(s) ready for generation.` });
      } catch (error) {
        console.error("Error reading files:", error);
        toast({ variant: "destructive", title: "File Read Error", description: "Could not read uploaded files." });
        setUploadedFilesContent([]);
        setUploadedFileNames([]);
      } finally {
        setIsLoading(false);
        if (event.target) {
          event.target.value = "";
        }
      }
    }
  };

  const handleGenerateCode = useCallback(async () => {
    if (!promptText.trim()) {
      toast({ variant: "destructive", title: "Prompt is empty", description: "Please enter a prompt to generate code." });
      return;
    }
    setIsLoading(true);
    setGeneratedCode("");
    try {
      const input: GenerateCodeInput = {
        prompt: promptText,
        uploadedFiles: uploadedFilesContent.length > 0 ? uploadedFilesContent : undefined,
      };
      const result = await generateCode(input);
      setGeneratedCode(result.generatedCode);
      toast({ title: "Code Generated", description: "The AI has generated code based on your prompt." });
    } catch (error) {
      console.error("Error generating code:", error);
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ variant: "destructive", title: "Generation Failed", description: errorMessage });
      setGeneratedCode(`// Error generating code: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [promptText, uploadedFilesContent, toast]);

  const handleCopyToClipboard = () => {
    if (!generatedCode) {
      toast({ variant: "destructive", title: "Nothing to Copy", description: "No code has been generated yet."});
      return;
    }
    navigator.clipboard.writeText(generatedCode)
      .then(() => toast({ title: "Copied to Clipboard!"}))
      .catch(err => toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy code to clipboard."}));
  };

  const handlePushToGithub = async () => {
    // Use GITHUB_TOKEN from environment if available, otherwise use user input
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || githubPat;

    if (!githubRepoUrl || !token || !generatedCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields or set GITHUB_TOKEN environment variable.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl: githubRepoUrl,
          branch: githubBranch || 'main',
          commitMessage: githubCommitMessage || 'feat: Add generated code',
          content: generatedCode,
          pat: token
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Success!",
        description: "Code successfully pushed to GitHub."
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Push Failed",
        description: error instanceof Error ? error.message : "Could not push to GitHub. Please check your credentials."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-primary">CodePilot</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsApiKeyModalOpen(true)} aria-label="API Key Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Panel 1: Input & Settings */}
            <Card className="md:col-span-1 flex flex-col shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="h-6 w-6 text-primary" />Input & Controls</CardTitle>
                <CardDescription>Provide your prompt and upload files to guide code generation.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6 overflow-y-auto p-6">
                <div>
                  <div className="space-y-4">
                  <div>
                    <Label htmlFor="github-import" className="text-base font-medium">GitHub Repository URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="github-import"
                        placeholder="https://github.com/username/repo"
                        className="flex-1"
                      />
                      <Button onClick={() => toast({ title: "Importing repository...", description: "This feature is coming soon!" })}>
                        Import
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">Your Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the code you want to generate..."
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      className="min-h-[150px] mt-1 text-sm"
                      disabled={isLoading}
                    />
                  </div>
</div>
                </div>

                <div>
                  <Label htmlFor="file-upload" className="text-base font-medium">Upload Files (Optional)</Label>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">TXT, JS, TS, PY, HTML, CSS, etc.</p>
                        </div>
                        <Input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} disabled={isLoading} accept=".txt,.js,.ts,.py,.html,.css,.md,.json,.*" />
                    </label>
                  </div>
                  {uploadedFileNames.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-foreground">Uploaded files:</p>
                      <ul className="list-disc list-inside pl-1">
                        {uploadedFileNames.map((name, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-center">
                            <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" /> {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button onClick={handleGenerateCode} disabled={isLoading || !promptText.trim()} className="w-full mt-auto py-3 text-base">
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isLoading ? "Generating..." : "Generate Code"}
                  {!isLoading && <Wand2 className="ml-2 h-5 w-5" />}
                </Button>
              </CardContent>
            </Card>

            {/* Panel 2: Code Output */}
            <Card className="md:col-span-1 flex flex-col shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  Generated Code
                </CardTitle>
                <CardDescription>View the code generated by the AI.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 relative rounded-b-lg">
                  <pre className="p-6 text-sm h-[calc(100vh-20rem)] md:h-auto md:min-h-[300px] whitespace-pre-wrap break-all bg-muted/30"><code className="font-mono">{generatedCode || "// Your generated code will appear here..."}</code></pre>
                  {generatedCode && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="absolute top-3 right-3 bg-background/50 hover:bg-background/80">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Panel 3: GitHub Integration */}
            <Card className="md:col-span-1 flex flex-col shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Github className="h-6 w-6 text-primary" />GitHub Integration</CardTitle>
                <CardDescription>Push generated code to GitHub repository.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4 p-6">
                <div>
                  <Label htmlFor="github-repo" className="text-base font-medium">Repository URL</Label>
                  <Input
                    id="github-repo"
                    placeholder="e.g., https://github.com/username/repo"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="github-branch" className="text-base font-medium">Branch</Label>
                  <Input
                    id="github-branch"
                    placeholder="e.g., main"
                    value={githubBranch}
                    onChange={(e) => setGithubBranch(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="github-commit" className="text-base font-medium">Commit Message</Label>
                  <Input
                    id="github-commit"
                    placeholder="Enter commit message"
                    value={githubCommitMessage}
                    onChange={(e) => setGithubCommitMessage(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="github-pat" className="text-base font-medium">Personal Access Token</Label>
                  <Input
                    id="github-pat"
                    type="password"
                    placeholder="GitHub Personal Access Token"
                    value={githubPat}
                    onChange={(e) => setGithubPat(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handlePushToGithub} 
                  disabled={isLoading || !githubRepoUrl || !githubPat || !generatedCode}
                  className="w-full mt-auto py-3 text-base"
                >
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Push to GitHub
                  {!isLoading && <Github className="ml-2 h-5 w-5" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <ApiKeyModal isOpen={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen} />
    </TooltipProvider>
  );
}