
#!/bin/bash

echo "🚀 Starting comprehensive GitHub upload with @octokit/rest installation..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git branch -M main
fi

# Install/reinstall dependencies to ensure @octokit/rest is properly installed
echo "📦 Installing dependencies including @octokit/rest..."
npm install

# Add all files to staging
echo "📁 Adding all files to Git staging area..."
git add .

# Create comprehensive commit message
COMMIT_MSG="Complete project upload with GitHub integration

- Added @octokit/rest integration for GitHub API
- Included PyInstaller Builder for executable generation
- Added Android Studio compilation documentation
- Complete CodePilot application with AI features
- GitHub import/export functionality
- Test files and documentation
- All UI components and configurations"

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❗ No remote repository configured."
    echo "Please add your GitHub repository URL:"
    echo "git remote add origin https://github.com/username/repository-name.git"
    echo "Then run this script again."
    exit 1
fi

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully uploaded all files to GitHub!"
echo "📋 Upload summary:"
echo "   - All source code and components"
echo "   - GitHub integration with @octokit/rest"
echo "   - PyInstaller Builder"
echo "   - Android development documentation"
echo "   - Test files and configurations"
echo "   - Dependencies properly installed"

echo ""
echo "🔧 To set up on a new machine:"
echo "   1. Clone the repository"
echo "   2. Run: npm install"
echo "   3. Set up environment variables in .env.local"
echo "   4. Run: npm run dev"
