import { CodePilotLayout } from "@/components/codepilot/CodePilotLayout";
import { Toaster } from "@/components/ui/toaster";
import { Wand2 } from 'lucide-react';
import GitHubImport from '@/components/GitHubImport';
import { PyInstallerBuilder } from "@/components/PyInstallerBuilder";

export default function Home() {
  return (
    <>
      <CodePilotLayout />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <GitHubImport />
        <PyInstallerBuilder />
      </main>
      <Toaster />
    </>
  );
}