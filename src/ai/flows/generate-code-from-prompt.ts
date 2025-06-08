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
