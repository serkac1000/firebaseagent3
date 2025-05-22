
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';

export async function POST(request: Request) {
  try {
    const { repoUrl } = await request.json();
    
    if (!repoUrl) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    // Extract owner and repo from URL
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
    if (!urlMatch) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 });
    }

    const [, owner, repo] = urlMatch;
    
    // Fetch repository contents from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }

    const contents = await response.json();
    const files = await Promise.all(
      contents.map(async (item: any) => {
        if (item.type === 'file') {
          const fileResponse = await fetch(item.download_url);
          const content = await fileResponse.text();
          return {
            path: item.path,
            content
          };
        }
        return null;
      })
    );

    return NextResponse.json({ 
      success: true, 
      files: files.filter(Boolean)
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import repository' },
      { status: 500 }
    );
  }
}
