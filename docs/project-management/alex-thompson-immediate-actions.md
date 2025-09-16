# Alex Thompson (Lead Developer) - Immediate Actions

## 🎯 URGENT - Start Within 3 Hours

**Expert**: Alex Thompson (Lead Developer)
**Role**: Next.js Application Foundation & Development Standards
**Priority**: CRITICAL - Core application structure
**Timeline**: Complete within 4 hours
**Depends On**: Taylor Morgan repository, Morgan Smith schema, Alex Johnson Linear assignment

## 📋 Immediate Tasks (Next 4 Hours)

### Task 1: Next.js 14 Application Initialization (1 hour)

- [ ] **Initialize Project**: Create Next.js 14 app with App Router
  ```bash
  npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"
  ```
- [ ] **Project Structure**:
  ```
  apps/web/
  ├── src/
  │   ├── app/                 # App Router pages
  │   ├── components/          # Shared components
  │   ├── lib/                 # Utilities and configurations
  │   ├── types/               # TypeScript type definitions
  │   └── styles/              # Global styles
  ├── prisma/                  # Database schema and migrations
  ├── public/                  # Static assets
  └── package.json
  ```
- [ ] **TypeScript Configuration**: Strict mode with path mapping
- [ ] **Tailwind Setup**: Configure with FAEVision design system

### Task 2: Package Configuration & Dependencies (1 hour)

- [ ] **Core Dependencies**:
  ```json
  {
    "dependencies": {
      "next": "14.0.0",
      "react": "18.2.0",
      "react-dom": "18.2.0",
      "@prisma/client": "latest",
      "prisma": "latest",
      "next-auth": "beta",
      "@auth/prisma-adapter": "latest",
      "zod": "latest",
      "react-hook-form": "latest",
      "@hookform/resolvers": "latest",
      "zustand": "latest",
      "swr": "latest",
      "@tailwindcss/forms": "latest",
      "@headlessui/react": "latest",
      "lucide-react": "latest",
      "framer-motion": "latest",
      "ai": "latest",
      "openai": "latest",
      "resend": "latest"
    },
    "devDependencies": {
      "@types/node": "20.0.0",
      "@types/react": "18.2.0",
      "@types/react-dom": "18.2.0",
      "typescript": "5.0.0",
      "eslint": "latest",
      "eslint-config-next": "latest",
      "prettier": "latest",
      "prettier-plugin-tailwindcss": "latest",
      "husky": "latest",
      "lint-staged": "latest",
      "vitest": "latest",
      "@testing-library/react": "latest",
      "@testing-library/jest-dom": "latest",
      "@playwright/test": "latest"
    }
  }
  ```

### Task 3: Code Quality & Development Tools (1 hour)

- [ ] **ESLint Configuration**:
  ```javascript
  // .eslintrc.json
  {
    "extends": [
      "next/core-web-vitals",
      "prettier"
    ],
    "rules": {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
  ```
- [ ] **Prettier Configuration**:
  ```javascript
  // .prettierrc
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "tabWidth": 2,
    "useTabs": false,
    "plugins": ["prettier-plugin-tailwindcss"]
  }
  ```
- [ ] **Husky Pre-commit Hooks**:
  ```json
  // lint-staged configuration
  {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
  ```

### Task 4: Testing Framework Setup (1 hour)

- [ ] **Vitest Configuration**:

  ```typescript
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        threshold: {
          global: {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
          },
        },
      },
    },
  });
  ```

- [ ] **Playwright Configuration**:

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    testDir: './src/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  });
  ```

## 🔗 Integration Requirements

### Database Integration (With Morgan Smith)

- [ ] **Prisma Client Setup**: Configure @prisma/client in Next.js
- [ ] **Database Connection**: Set up connection in lib/prisma.ts
- [ ] **Type Generation**: Ensure Prisma types available in TypeScript
- [ ] **Migration Scripts**: Add database scripts to package.json

### Authentication Foundation (NextAuth.js v5)

- [ ] **NextAuth Setup**: Basic configuration for future implementation
- [ ] **Provider Preparation**: Prepare for email/password authentication
- [ ] **Session Management**: Set up session types and utilities
- [ ] **Middleware**: Prepare authentication middleware

### Development Scripts

- [ ] **Package.json Scripts**:
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "lint:fix": "next lint --fix",
      "type-check": "tsc --noEmit",
      "test": "vitest",
      "test:watch": "vitest --watch",
      "test:coverage": "vitest --coverage",
      "test:e2e": "playwright test",
      "test:e2e:ui": "playwright test --ui",
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:migrate": "prisma migrate dev",
      "db:seed": "prisma db seed",
      "db:studio": "prisma studio"
    }
  }
  ```

## 🎨 Design System Integration

### Tailwind Configuration

- [ ] **FAEVision Colors**: Implement executive color system
  ```javascript
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        colors: {
          executive: {
            blue: '#3b82f6',
            green: '#10b981',
            gold: '#f59e0b',
            red: '#ef4444',
            purple: '#a855f7',
            gray: '#6b7280',
          },
        },
      },
    },
  };
  ```
- [ ] **Typography Scale**: Executive-focused typography hierarchy
- [ ] **Component Utilities**: Executive UX utility classes
- [ ] **Responsive Breakpoints**: Mobile-first executive design

### Component Foundation

- [ ] **Layout Components**: Header, navigation, footer structure
- [ ] **UI Primitives**: Button, Input, Card, Badge components
- [ ] **Executive Patterns**: Dashboard, metrics, status components
- [ ] **Accessibility**: ARIA labels and semantic HTML structure

## 🎯 Success Criteria (4 Hours)

- [ ] Next.js 14 application initialized with TypeScript and App Router
- [ ] Complete dependency configuration for all FAEVision requirements
- [ ] Code quality tools (ESLint, Prettier, Husky) operational
- [ ] Testing framework (Vitest, Playwright) configured with coverage
- [ ] Database integration ready for Prisma schema
- [ ] Development scripts and workflow operational
- [ ] Ready for feature development and deployment

## 🚨 Dependencies & Coordination

- **Waiting For**:
  - Taylor Morgan repository setup (FAE-006 assignment)
  - Morgan Smith Prisma schema (database integration)
  - Alex Johnson Linear workspace setup
- **Provides To**: All developers (application foundation)
- **Coordinates With**: Jordan Kim (Vercel deployment), Jordan Lee (Cursor configuration)

## 📞 Status Updates

Report progress in Linear FAE-006 comments:

- [ ] Next.js application initialized
- [ ] Dependencies and tooling configured
- [ ] Testing framework operational
- [ ] Database integration ready
- [ ] Ready for feature development

## 🚀 Next Steps After Completion

- Integrate Morgan Smith's Prisma schema
- Set up basic authentication structure
- Create initial layout and navigation components
- Coordinate with UX/Design experts for component development

**STATUS**: ⏳ WAITING FOR REPOSITORY & LINEAR ASSIGNMENT → 🚀 START IMMEDIATELY WHEN READY
