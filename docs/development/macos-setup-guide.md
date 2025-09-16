# macOS Development Environment Setup - FAEVision

## 🍎 macOS Development Guide for FAEVision MVP

**Expert:** Jordan Lee (Cursor Expert)  
**Last Updated:** September 2025  
**Target:** macOS 12+ (Monterey, Ventura, Sonoma, Sequoia)

---

## 🚀 Quick Setup (5 Minutes)

### Prerequisites

```bash
# Verify Node.js version (Required: 18.x or 20.x)
node --version  # Should show v18.x.x or v20.x.x

# Verify npm version
npm --version   # Should show 8.x.x or higher

# Verify Git
git --version   # Should be installed via Xcode Command Line Tools
```

### Fast Track Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/faevision-simplified.git
cd faevision-simplified

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.local.example .env.local

# 4. Generate Prisma client
npx prisma generate

# 5. Test the build
npm run build

# 6. Start development server
npm run dev
```

---

## 🔧 Detailed Setup & Configuration

### Node.js & Package Management

**Recommended Approach: Use Node Version Manager (nvm)**

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install and use Node.js 20 (recommended for Next.js 14)
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Development Tools Configuration

**Cursor IDE Setup:**

```bash
# Install Cursor extensions (if not already installed)
# - TypeScript and JavaScript Language Features
# - Tailwind CSS IntelliSense
# - Prisma
# - ESLint
# - Prettier

# Configure Cursor settings for FAEVision
mkdir -p .vscode
```

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.emmetCompletions": true,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## ⚠️ Known Issues & Solutions

### Issue 1: npm Permission Errors (Global Packages)

**Symptom:** `EACCES: permission denied` when installing global packages

```bash
# ❌ This fails on macOS:
npm install -g vercel

# ✅ Solution 1: Use npx instead
npx vercel

# ✅ Solution 2: Configure npm to use different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Issue 2: Multiple package-lock.json Conflicts

**Symptom:** Next.js warns about multiple lockfiles

```bash
# ⚠️ Warning: Next.js inferred your workspace root incorrectly

# ✅ Solution: Clean up unnecessary lockfiles
find . -name "package-lock.json" -not -path "./node_modules/*"
# Keep only the root package-lock.json, remove others
```

### Issue 3: Prisma Generation Errors

**Symptom:** `Cannot find module '@prisma/client'`

```bash
# ✅ Solution: Regenerate Prisma client
npx prisma generate

# If still failing, check schema location
npx prisma generate --schema=./prisma/schema.prisma
```

### Issue 4: Tailwind CSS Not Loading

**Symptom:** Styles not applying in development

```bash
# ✅ Solution 1: Restart dev server
npm run dev

# ✅ Solution 2: Clear Next.js cache
rm -rf .next
npm run dev

# ✅ Solution 3: Verify Tailwind config
npx tailwindcss --help
```

### Issue 5: Port Already in Use

**Symptom:** `Error: listen EADDRINUSE :::3000`

```bash
# ✅ Solution 1: Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# ✅ Solution 2: Use different port
npm run dev -- --port 3001
```

---

## 🏗️ Build & Deployment Troubleshooting

### Common Build Issues

**TypeScript Errors:**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix common issues
npm run lint
npm run lint -- --fix
```

**Missing Dependencies:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables:**

```bash
# Verify environment setup
cat .env.local

# Required variables for development:
# DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
```

---

## 🚀 Performance Optimization (macOS)

### Development Server Performance

```bash
# Use Turbopack for faster builds (Next.js 14)
npm run dev -- --turbo

# Increase Node.js memory limit for large projects
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### File Watching Optimization

```bash
# Increase file watcher limit (macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 🔒 Security Considerations

### Environment Variables

```bash
# Never commit .env.local to Git
echo ".env.local" >> .gitignore

# Use strong secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
```

### Local Development Security

```bash
# Verify localhost-only binding
npm run dev  # Should only bind to localhost:3000

# Use HTTPS in development (optional)
npm install --save-dev @types/https-localhost
```

---

## 🎯 Recommended Workflow

### Daily Development

```bash
# 1. Start development
npm run dev

# 2. Check for issues
npm run lint
npm run type-check

# 3. Test build occasionally
npm run build

# 4. Commit frequently
git add -A
git commit -m "feature: description"
```

### Before Deployment

```bash
# Full verification
npm run build
npm run start  # Test production build locally
```

---

## 📞 Getting Help

### Expert Contacts

- **Cursor Issues:** Jordan Lee (Cursor Expert)
- **Build Issues:** Alex Thompson (Lead Developer)
- **Deployment Issues:** Jordan Kim (Vercel Engineer)
- **Database Issues:** Morgan Smith (Database Architect)

### Useful Commands

```bash
# Debug information
node --version
npm --version
npx next info

# Project health check
npm audit
npm run build
npm run lint
```

---

## 🔄 Update Procedures

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update minor versions
npm update

# Update major versions (with caution)
npm install package@latest
```

### Updating Node.js

```bash
# Using nvm
nvm install node
nvm use node
nvm alias default node
```

---

**Quick Troubleshooting:** If anything breaks, run `npm run build` first to identify the issue, then consult this guide or contact the appropriate expert.
