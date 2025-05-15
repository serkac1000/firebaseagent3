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

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer who specializes in generating code based on user prompts and existing code files.

  Prompt: {{{prompt}}}

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
  \nGenerate the code:
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
