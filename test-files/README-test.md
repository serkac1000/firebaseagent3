
# GitHub Integration Test Files

This directory contains test files for validating the GitHub integration functionality in CodePilot.

## Test Files Overview

### 1. sample-code.py
- **Purpose**: Test Python code generation and pushing to GitHub
- **Features**: 
  - Fibonacci sequence calculator
  - Factorial function
  - Calculator class with history
- **Usage**: Can be used to test PyInstaller builder functionality

### 2. sample-web.html
- **Purpose**: Test web-based file integration
- **Features**:
  - Responsive design
  - Interactive JavaScript
  - CSS styling
- **Usage**: Demonstrates web file handling in GitHub integration

### 3. Test Scenarios

#### Scenario 1: Code Generation Test
1. Generate Python code using AI prompts
2. Use the GitHub integration panel to push code
3. Verify commit appears in target repository

#### Scenario 2: Repository Import Test
1. Use GitHub Import component to import a repository
2. Verify files are correctly parsed and displayed
3. Test modification and re-upload functionality

#### Scenario 3: PyInstaller Test
1. Upload sample-code.py to PyInstaller Builder
2. Generate executable and Android project structure
3. Test the generated files

## Expected Outcomes

✅ **Success Criteria:**
- Files push successfully to GitHub repository
- Commit messages are properly formatted
- Repository import works with public repositories
- Generated executables run correctly
- Android project structure is valid

❌ **Failure Indicators:**
- Authentication errors with GitHub API
- Invalid repository URLs
- Missing or corrupted generated files
- Build errors in PyInstaller process

## Environment Variables Required

For full testing, ensure these are configured:
- GitHub Personal Access Token (PAT)
- Target repository URL
- Branch name (default: main)

## Last Updated
Generated: $(date)
Test Version: 1.0.0
