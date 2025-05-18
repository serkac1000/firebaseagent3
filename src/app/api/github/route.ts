
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
  try {
    const { repoUrl, branch, commitMessage, content, pat } = await request.json();

    // Parse repository owner and name from URL
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
    if (!repoMatch) {
      return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 });
    }

    const [_, owner, repo] = repoMatch;
    const octokit = new Octokit({ auth: pat });

    // Get the default branch's last commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    // Create blob with file content
    const { data: blob } = await octokit.git.createBlob({
      owner,
      repo,
      content,
      encoding: 'utf-8',
    });

    // Create tree
    const { data: tree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: ref.object.sha,
      tree: [{
        path: 'generated-code.txt',
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      }],
    });

    // Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: tree.sha,
      parents: [ref.object.sha],
    });

    // Update branch reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: commit.sha,
    });

    return NextResponse.json({ success: true, commitUrl: commit.html_url });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Failed to push to GitHub' }, { status: 500 });
  }
}
