'use server';

/**
 * @fileOverview An AI agent that generates code from a prompt, considering optional file uploads.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  prompt: z.string().describe('A detailed prompt describing the code to generate.'),
  uploadedFiles: z
    .array(z.string())
    .optional()
    .describe('An optional list of file contents (strings) to assist with code generation.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The code generated based on the prompt.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<{ generatedCode: string }> {
  const { prompt, uploadedFiles } = input;

  // Force Python code generation for mobile app development
  let fullPrompt = `Generate a complete Python application based on this request: "${prompt}"

IMPORTANT: You must generate ONLY Python code, never JavaScript, React, or any other language.

Requirements for Python mobile app development:
- Use Kivy framework for mobile UI if interface is needed
- Create a complete .py file with proper Python syntax
- Include all necessary Python imports (kivy, os, sys, etc.)
- Add proper main function with if __name__ == "__main__": block
- Make it compatible with Android compilation using Buildozer
- Include detailed comments explaining the code
- Ensure the code is executable and mobile-friendly
- Use Python syntax only - no JavaScript/React syntax

Generate ONLY Python code starting with Python imports.`;

  if (uploadedFiles && uploadedFiles.length > 0) {
    fullPrompt += `\n\nHere are the uploaded files for context:\n${uploadedFiles.join('\n\n')}`;
  }

  fullPrompt += `\n\nOutput format: Complete Python (.py) file content only. Start with Python imports, not JavaScript imports.`;

  const result = await ai.generate({
    model: 'gemini-1.5-flash',
    prompt: fullPrompt,
  });

  const generatedCode = result.text();

  // Validate that it's Python code, not JavaScript/React
  if (generatedCode.includes('import React') || 
      generatedCode.includes('from react') || 
      generatedCode.includes('useState') ||
      generatedCode.includes('jsx') ||
      generatedCode.includes('tsx')) {

    // If it generated non-Python code, force regenerate with stricter prompt
    const pythonOnlyPrompt = `Generate ONLY Python code for: ${prompt}

CRITICAL: Do NOT use any JavaScript, React, or web technologies. 
Use Python with Kivy framework for mobile development.
Start with Python imports like: import kivy, from kivy.app import App
Create a Python class that extends App.
Include if __name__ == "__main__": at the end.

Generate pure Python code only:`;

    const retryResult = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: pythonOnlyPrompt,
    });

    return {
      generatedCode: retryResult.text(),
    };
  }

  return {
    generatedCode: generatedCode,
  };
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert Python developer who specializes in creating mobile applications for Android using Python and Kivy framework.

  User Request: {{{prompt}}}

  {{#if uploadedFiles}}
  The following files were uploaded to assist you. Use them to improve your generated code:
  {{#each uploadedFiles}}
  --------------------------------
  {{this}}
  --------------------------------
  {{/each}}
  {{else}}
  No files were uploaded. Generate code based solely on the prompt.
  {{/if}}

  IMPORTANT REQUIREMENTS:
  - Generate ONLY Python code (.py file)
  - Use Kivy framework for mobile UI if needed
  - Include all necessary imports
  - Make the code compatible with Android compilation via Buildozer
  - Include proper main() function and if __name__ == "__main__" block
  - Add clear comments explaining the functionality
  - Ensure the code is complete and executable
  - Do NOT generate JavaScript, React, HTML, or any other language

  Generate the complete Python code:
  `,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);