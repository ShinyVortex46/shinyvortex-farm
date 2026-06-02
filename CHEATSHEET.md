# ShinyVortex Farm — Developer Cheatsheet

## Git

```bash
# Check what's changed since last commit
git status

# Stage all changes
git add .

# Stage a specific file
git add src/utils/sprites.js

# Commit with a message
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest from GitHub
git pull

# See commit history (compact)
git log --oneline

# Undo changes to a file (before staging)
git restore filename

# See what actually changed in files
git diff
```

### Commit message conventions
```
feat: add sprite helper functions
fix: correct shiny URL path
style: update farm background
chore: update dependencies
```

---

## React & npm

```bash
# Start the local dev server
npm start

# Install a new package
npm install package-name

# Stop the dev server
Ctrl+C
```

---

## Claude Code

```bash
# Start Claude Code in project folder
claude

# Exit Claude Code
exit
```

---

## Navigation

```bash
# Go to project folder
cd ~/shinyvortex-farm

# Open project in VS Code
code ~/shinyvortex-farm

# Open integrated terminal in VS Code
Ctrl+`
```

---

## Sprite URLs (PokeAPI)

```javascript
// Regular sprite
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png

// Shiny sprite
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/{id}.png

// Pokémon cry (sound)
https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg
```

---

## Helper function (src/utils/sprites.js)

```javascript
getSpriteUrl(id, isShiny = false)  // returns sprite URL
getCryUrl(id)                       // returns cry sound URL
```

---

## Typical workflow

```bash
# 1. Navigate to project
cd ~/shinyvortex-farm

# 2. Start dev server
npm start

# 3. Make changes in VS Code

# 4. Stage and commit
git add .
git commit -m "feat: describe what you did"

# 5. Push to GitHub
git push
```
