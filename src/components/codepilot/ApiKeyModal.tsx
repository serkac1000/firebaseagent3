// src/components/codepilot/ApiKeyModal.tsx
"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiKeyModal({ isOpen, onOpenChange }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useLocalStorage<string>("gemini_api_key", "");
  const [currentKeyValue, setCurrentKeyValue] = useState(apiKey);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentKeyValue(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || apiKey || "");
  }, [apiKey]);

  const checkApiKey = async (key: string) => {
    // TODO: Implement actual API key validation logic here
    // This is a placeholder check
    if (key && key.length > 10) { // Simple length check as a placeholder
      setIsApiKeyValid(true);
      toast({
        title: "API Key Validated",
        description: "Your Gemini API key appears to be valid.",
      });
    } else {
      setIsApiKeyValid(false);
      toast({
        title: "API Key Validation Failed",
        description: "Your Gemini API key appears to be invalid. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setApiKey(currentKeyValue);
    await checkApiKey(currentKeyValue);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Gemini API Key</DialogTitle>
          <DialogDescription>
            Enter your Gemini API key. This key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={currentKeyValue}
              onChange={(e) => setCurrentKeyValue(e.target.value)}
              className="col-span-3"
              type="password"
            />
          </div>
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important Note!</AlertTitle>
            <AlertDescription>
              For AI features to work correctly, ensure this API key is also configured
              in your server environment (e.g., via a <code>.env.local</code> file as <code>GOOGLE_API_KEY</code> or <code>GOOGLE_GENAI_API_KEY</code>).
              Storing the key here is for your reference and for potential future client-side uses if applicable.
              Server-side AI operations will rely on environment variables.
            </AlertDescription>
          </Alert>
          {currentKeyValue && (
            <div className={`text-sm ${isApiKeyValid ? "text-green-600" : "text-red-600"}`}>
              {isApiKeyValid
                ? "API Key status: Valid"
                : "API Key status: Invalid or not yet validated"}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>Save API Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
