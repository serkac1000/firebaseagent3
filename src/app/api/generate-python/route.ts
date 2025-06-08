
import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/ai/flows/generate-code-from-prompt';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhanced prompt to ensure Python code generation for Android
    const enhancedPrompt = `Generate a complete Python application based on this request: "${prompt}"

Requirements:
- Create a complete Python (.py) file
- Use Kivy framework for mobile app development if UI is needed
- Include proper imports and dependencies
- Make it compatible with Android compilation using Buildozer
- Add proper main function and if __name__ == "__main__" block
- Include comments explaining the code
- Ensure the code is executable and mobile-friendly

Generate only Python code, no JavaScript or React components.`;

    const result = await generateCode({
      prompt: enhancedPrompt,
      uploadedFiles: undefined
    });

    // Extract filename from the generated code or create a default one
    const filename = extractFilenameFromCode(result.generatedCode) || 'generated_app.py';

    return NextResponse.json({
      success: true,
      pythonCode: result.generatedCode,
      filename: filename,
      message: 'Python code generated successfully for Android compilation'
    });

  } catch (error: any) {
    console.error('Error generating Python code:', error);
    return NextResponse.json({
      error: 'Failed to generate Python code',
      details: error.message
    }, { status: 500 });
  }
}

function extractFilenameFromCode(code: string): string | null {
  // Try to extract a meaningful filename from comments or class names
  const classMatch = code.match(/class\s+(\w+)/);
  const appMatch = code.match(/class\s+(\w+)App/);
  
  if (appMatch) {
    return `${appMatch[1].toLowerCase()}_app.py`;
  } else if (classMatch) {
    return `${classMatch[1].toLowerCase()}.py`;
  }
  
  return null;
}
