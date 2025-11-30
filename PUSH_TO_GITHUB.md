# Push to GitHub Instructions

## Option 1: Using GitHub CLI (Recommended)

1. Authenticate with GitHub:
   ```bash
   gh auth login
   ```

2. Create repository and push:
   ```bash
   gh repo create wordle-score --public --source=. --remote=origin --push
   ```

## Option 2: Manual Creation

1. Go to https://github.com/new
2. Repository name: `wordle-score`
3. Description: "Wordle Score Calculator - Calculate scores from Wordle share text"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

7. Then run these commands:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wordle-score.git
   git branch -M main
   git push -u origin main
   ```

## Option 3: Using SSH (if you have SSH keys set up)

1. Create repository on GitHub (same as Option 2, steps 1-6)

2. Then run:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/wordle-score.git
   git branch -M main
   git push -u origin main
   ```

Note: Replace `YOUR_USERNAME` with your actual GitHub username.

