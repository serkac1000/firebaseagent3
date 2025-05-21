```bash
  #!/bin/bash

  # Navigate to the repository directory
  REPO_PATH="/e/PRODUCTION/firebaseagent3-main"
  if ! cd "$REPO_PATH"; then
      echo "Error: Directory $REPO_PATH does not exist. Please check the path and try again."
      exit 1
  fi

  # Check if the directory is a Git repository
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      echo "Error: $REPO_PATH is not a Git repository. Initialize it with 'git init' or clone the correct repository."
      exit 1
  fi

  # Fetch the latest changes from GitHub
  if ! git fetch origin; then
      echo "Error: Failed to fetch from remote repository. Check your remote configuration and network."
      exit 1
  fi

  # Check for differences between local and remote
  echo "Checking differences between local and remote (origin/main)..."
  git diff origin/main

  # Prompt user to proceed
  read -p "Do you want to stage and push changes? (y/n): " answer
  if [ "$answer" != "y" ]; then
      echo "Aborting..."
      exit 1
  fi

  # Stage all changes
  if ! git add .; then
      echo "Error: Failed to stage changes."
      exit 1
  fi

  # Commit changes with a message
  if ! git commit -m "Updated fixed code from local PC"; then
      echo "Error: Failed to commit changes. There may be no changes to commit."
      exit 1
  fi

  # Push to GitHub
  if ! git push origin main; then
      echo "Error: Failed to push changes to GitHub. Check for conflicts or authentication issues."
      exit 1
  fi

  echo "Changes successfully pushed to GitHub!"
  ```