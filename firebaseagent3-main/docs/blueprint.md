# **App Name**: CodePilot

## Core Features:

- API Key Input: Enable users to input their Gemini API key via a GUI settings panel. This is essential for authenticating requests to the Gemini API.
- API Key Edit: Allow users to edit their saved Gemini API key through the GUI settings panel.
- Code Generation with Gemini: Accept user-defined prompts through the GUI to guide the code generation process. Use a tool with the Gemini API to generate code based on these prompts, and leverage chain-of-thought reasoning to determine if files provided by the user can be used for better code output.
- File Upload: Allow users to upload code files directly through the GUI for use with the code generation. CodePilot shall consider code uploaded to assist Gemini.
- GitHub Integration: Implement a function to commit and push generated code to a specified GitHub repository directly from the GUI.

## Style Guidelines:

- Primary color: Use a deep blue (#1A237E) to evoke trust and stability.
- Secondary color: Implement light gray (#E0E0E0) for backgrounds to ensure readability and reduce eye strain.
- Accent: Use teal (#00BCD4) for interactive elements and calls to action.
- Clean and readable sans-serif fonts to ensure readability, such as the default system fonts.
- Simple and clear icons for actions like upload, generate, and commit.
- Split the screen into panels: one for input and settings, one for output code display, and another for GitHub integration controls.