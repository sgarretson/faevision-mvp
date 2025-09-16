# FAEVision MVP - Technical Architecture Specification

**Version**: 1.0  
**Date**: December 9, 2024  
**Team**: 11 Expert Specialists - Unanimous Consensus  
**Status**: APPROVED FOR IMPLEMENTATION  
**Approach**: Vercel-First Architecture for 50-User Internal MVP

---

## 🏗️ Architecture Overview

### Design Philosophy

Our technical architecture prioritizes **simplicity, performance, and developer productivity** for a 50-user internal MVP. We leverage Vercel's ecosystem to minimize operational overhead while providing enterprise-grade capabilities.

### Core Architectural Principles

1. **Vercel-First**: Leverage Vercel ecosystem for maximum efficiency
2. **TypeScript Everywhere**: Full type safety across frontend and backend
3. **Real-Time Collaboration**: Server-Sent Events for live updates
4. **AI-Enhanced**: Integrated AI capabilities with fallback mechanisms
5. **Mobile-Responsive**: Progressive enhancement for all device types
6. **Security-Focused**: Built-in security with audit trails

---

## 🎯 Technology Stack (Unanimous Team Decision)

### Frontend Architecture

#### Core Framework

```typescript
// Next.js 14 with App Router
"next": "^14.0.0"
"react": "^18.2.0"
"typescript": "^5.0.0"
```

#### UI & Styling

```typescript
// Tailwind CSS + Headless UI for design system
"tailwindcss": "^3.4.0"
"@headlessui/react": "^1.7.0"
"framer-motion": "^10.0.0"
"lucide-react": "^0.400.0"
```

#### State Management & Data

```typescript
// Zustand for global state, SWR for server state
"zustand": "^4.4.0"
"swr": "^2.2.0"
"react-hook-form": "^7.48.0"
"zod": "^3.22.0"
```

### Backend Architecture

#### API & Database

```typescript
// Next.js API Routes + Prisma + PostgreSQL
"prisma": "^5.7.0"
"@prisma/client": "^5.7.0"
"@vercel/postgres": "^0.5.0"
```

#### Authentication & Security

```typescript
// NextAuth.js for authentication
"next-auth": "^5.0.0-beta.4"
"bcryptjs": "^2.4.3"
"jsonwebtoken": "^9.0.0"
```

#### AI Integration

```typescript
// Vercel AI SDK + OpenAI
"ai": "^2.2.0"
"openai": "^4.20.0"
"@vercel/blob": "^0.15.0"
```

### Infrastructure & Deployment

#### Vercel Platform Services

- **Hosting**: Vercel Edge Network with global CDN
- **Database**: Vercel Postgres (managed PostgreSQL)
- **Storage**: Vercel Blob for file attachments
- **Functions**: Vercel Serverless Functions for API and background jobs
- **Analytics**: Vercel Analytics and Speed Insights
- **Monitoring**: Built-in performance and error monitoring

#### Development & CI/CD

```yaml
# GitHub Actions + Vercel Integration
- Source Control: GitHub with branch protection
- CI/CD: Vercel GitHub integration + custom actions
- Testing: Vitest + Playwright + TypeScript
- Code Quality: ESLint + Prettier + Husky
- Deployment: Automatic with preview environments
```

---

## 🏛️ Application Architecture

### Frontend Architecture (Next.js 14 App Router)

#### Directory Structure

```
src/
├── app/                    # App Router pages and layouts
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI components (buttons, inputs)
│   ├── forms/             # Form components
│   ├── collaboration/     # Voting, commenting components
│   └── admin/             # Admin-specific components
├── lib/                   # Utility functions and configurations
│   ├── auth/              # Authentication utilities
│   ├── db/                # Database utilities and Prisma client
│   ├── ai/                # AI integration utilities
│   └── utils/             # General utilities
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── styles/                # Additional CSS files
```

#### Component Architecture

```typescript
// Example component structure
interface InputCardProps {
  input: Input;
  currentUser: User;
  onVote: (inputId: string, voteType: 'up' | 'down') => void;
  onComment: (inputId: string, content: string) => void;
}

export function InputCard({ input, currentUser, onVote, onComment }: InputCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Component implementation */}
    </div>
  );
}
```

### Backend Architecture (Next.js API Routes)

#### API Route Structure

```
src/app/api/
├── auth/                  # Authentication endpoints
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── inputs/                # Input management
│   ├── route.ts           # GET, POST /api/inputs
│   ├── [id]/route.ts      # GET, PUT, DELETE /api/inputs/[id]
│   └── [id]/vote/route.ts # POST /api/inputs/[id]/vote
├── solutions/             # Solution management
├── requirements/          # Executive requirements
├── documents/             # FRD generation
├── admin/                 # Admin functions
└── realtime/              # Server-Sent Events
    ├── inputs/route.ts    # Real-time input updates
    └── comments/route.ts  # Real-time comment updates
```

#### Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}

model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String
  role        Role     @default(CONTRIBUTOR)
  department  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  inputs      Input[]
  comments    Comment[]
  votes       Vote[]
  solutions   Solution[]
  requirements Requirement[]

  @@map("users")
}

model Input {
  id          String      @id @default(cuid())
  title       String
  description String
  type        InputType
  status      InputStatus @default(NEW)
  department  String?
  issueType   IssueType?
  rootCause   String?
  userId      String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user        User        @relation(fields: [userId], references: [id])
  comments    Comment[]
  votes       Vote[]
  groups      GroupInput[]
  solutions   SolutionInput[]

  @@map("inputs")
}

model Solution {
  id           String         @id @default(cuid())
  title        String
  description  String
  status       SolutionStatus @default(PLANNING)
  priority     Priority       @default(MEDIUM)
  ownerId      String
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  owner        User           @relation(fields: [ownerId], references: [id])
  inputs       SolutionInput[]
  tasks        Task[]
  requirements Requirement[]
  documents    FRDDocument[]

  @@map("solutions")
}

model Requirement {
  id          String            @id @default(cuid())
  solutionId  String
  title       String
  description String
  status      RequirementStatus @default(DRAFT)
  priority    Priority          @default(MEDIUM)
  createdBy   String
  approvedBy  String?
  createdAt   DateTime          @default(now())
  approvedAt  DateTime?

  solution    Solution          @relation(fields: [solutionId], references: [id])
  creator     User              @relation(fields: [createdBy], references: [id])
  comments    Comment[]
  votes       Vote[]

  @@map("requirements")
}

// Additional models: Comment, Vote, Group, Task, FRDDocument...
```

### Real-Time Architecture

#### Server-Sent Events Implementation

```typescript
// src/app/api/realtime/inputs/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const stream = new ReadableStream({
    start(controller) {
      // Setup real-time input updates
      const sendUpdate = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Database change listeners
      setupInputChangeListener(sendUpdate);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

#### Client-Side Real-Time Integration

```typescript
// hooks/useRealTimeInputs.ts
export function useRealTimeInputs() {
  const [inputs, setInputs] = useState<Input[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/realtime/inputs');

    eventSource.onmessage = event => {
      const update = JSON.parse(event.data);
      setInputs(prev => updateInputsArray(prev, update));
    };

    return () => eventSource.close();
  }, []);

  return inputs;
}
```

---

## 🤖 AI Integration Architecture

### Vercel AI SDK Implementation

#### AI Service Configuration

```typescript
// lib/ai/config.ts
import { openai } from '@ai-sdk/openai';
import { createAI } from 'ai/rsc';

export const ai = createAI({
  model: openai('gpt-4-turbo'),
  system: `You are an expert assistant for FAEVision, helping with organizational efficiency.
           Focus on clear, actionable insights for business professionals.`,
});
```

#### Auto-Tagging Implementation

```typescript
// lib/ai/tagging.ts
import { generateObject } from 'ai';
import { z } from 'zod';

const TaggingSchema = z.object({
  department: z.string().describe('Most relevant department'),
  issueType: z.enum([
    'Process',
    'Technology',
    'Communication',
    'Resource',
    'Other',
  ]),
  rootCause: z.string().describe('Likely root cause of the issue'),
  confidence: z.number().min(0).max(1),
});

export async function generateTags(title: string, description: string) {
  const { object } = await generateObject({
    model: openai('gpt-3.5-turbo'),
    schema: TaggingSchema,
    prompt: `Analyze this input and suggest appropriate tags:
             Title: ${title}
             Description: ${description}`,
  });

  return object;
}
```

#### Document Generation System

```typescript
// lib/ai/document-generation.ts
import { streamText } from 'ai';

export async function generateFRD(
  solution: Solution,
  requirements: Requirement[]
) {
  const prompt = `Generate a professional Functional Requirements Document for:
    Solution: ${solution.title}
    Description: ${solution.description}
    Requirements: ${requirements.map(r => r.description).join('\n')}
    
    Format as a comprehensive FRD with sections:
    1. Executive Summary
    2. Functional Requirements
    3. Implementation Plan
    4. Success Criteria
    5. Risk Assessment`;

  const { textStream } = await streamText({
    model: openai('gpt-4-turbo'),
    prompt,
    maxTokens: 4000,
  });

  return textStream;
}
```

### AI Feature Integration Points

1. **Input Creation**: Auto-tagging and duplicate detection
2. **Group Suggestions**: Similarity analysis for input grouping
3. **Requirements Generation**: AI-assisted requirements from solution data
4. **Document Generation**: Professional FRD creation
5. **Content Analysis**: Trend detection and insights

---

## 🗄️ Database Architecture

### Prisma Schema Design

#### Core Entity Models

```prisma
enum Role {
  ADMIN
  EXECUTIVE
  CONTRIBUTOR
}

enum InputType {
  PROBLEM
  OPPORTUNITY
  GENERAL
}

enum InputStatus {
  NEW
  DISCUSSING
  ORGANIZED
  IN_SOLUTION
  ARCHIVED
}

enum IssueType {
  PROCESS
  TECHNOLOGY
  COMMUNICATION
  RESOURCE
  OTHER
}

enum SolutionStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum RequirementStatus {
  DRAFT
  REVIEW
  APPROVED
  REJECTED
  REVISED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

#### Relationship Design

```prisma
// Many-to-many relationships for flexibility
model SolutionInput {
  solutionId String
  inputId    String
  createdAt  DateTime @default(now())

  solution   Solution @relation(fields: [solutionId], references: [id])
  input      Input    @relation(fields: [inputId], references: [id])

  @@id([solutionId, inputId])
  @@map("solution_inputs")
}

// Polymorphic comments and votes
model Comment {
  id         String      @id @default(cuid())
  content    String
  entityType EntityType  // INPUT, SOLUTION, REQUIREMENT
  entityId   String
  userId     String
  parentId   String?     // For threaded comments
  createdAt  DateTime    @default(now())

  user       User        @relation(fields: [userId], references: [id])
  parent     Comment?    @relation("CommentThread", fields: [parentId], references: [id])
  replies    Comment[]   @relation("CommentThread")

  @@map("comments")
}
```

### Database Performance Optimization

#### Indexing Strategy

```sql
-- Performance indexes for common queries
CREATE INDEX CONCURRENTLY idx_inputs_status_department ON inputs(status, department);
CREATE INDEX CONCURRENTLY idx_inputs_type_created_at ON inputs(type, created_at DESC);
CREATE INDEX CONCURRENTLY idx_comments_entity ON comments(entity_type, entity_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_votes_entity ON votes(entity_type, entity_id, user_id);
CREATE INDEX CONCURRENTLY idx_solutions_status_owner ON solutions(status, owner_id);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_inputs_search ON inputs USING GIN (
  to_tsvector('english', title || ' ' || description)
);
```

#### Connection Management

```typescript
// lib/db/connection.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 🔐 Authentication & Security Architecture

### NextAuth.js Configuration

#### Authentication Setup

```typescript
// lib/auth/config.ts
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (
          user &&
          (await compare(credentials.password as string, user.password))
        ) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as Role;
      session.user.department = token.department as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
};
```

#### Role-Based Access Control

```typescript
// lib/auth/permissions.ts
export const permissions = {
  inputs: {
    create: ['ADMIN', 'EXECUTIVE', 'CONTRIBUTOR'],
    read: ['ADMIN', 'EXECUTIVE', 'CONTRIBUTOR'],
    update: (user: User, input: Input) =>
      user.role === 'ADMIN' ||
      user.role === 'EXECUTIVE' ||
      user.id === input.userId,
    delete: ['ADMIN'],
  },
  solutions: {
    create: ['ADMIN', 'EXECUTIVE', 'CONTRIBUTOR'],
    update: (user: User, solution: Solution) =>
      user.role === 'ADMIN' ||
      user.role === 'EXECUTIVE' ||
      user.id === solution.ownerId,
    delete: ['ADMIN', 'EXECUTIVE'],
  },
  requirements: {
    create: ['ADMIN', 'EXECUTIVE'],
    approve: ['ADMIN', 'EXECUTIVE'],
    update: (user: User, requirement: Requirement) =>
      user.role === 'ADMIN' ||
      (user.role === 'EXECUTIVE' && requirement.status !== 'APPROVED'),
  },
} as const;
```

### Security Implementation

#### Input Validation & Sanitization

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const CreateInputSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  type: z.enum(['PROBLEM', 'OPPORTUNITY', 'GENERAL']),
  department: z.string().optional(),
  issueType: z
    .enum(['PROCESS', 'TECHNOLOGY', 'COMMUNICATION', 'RESOURCE', 'OTHER'])
    .optional(),
  rootCause: z.string().max(500).optional(),
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  entityType: z.enum(['INPUT', 'SOLUTION', 'REQUIREMENT']),
  entityId: z.string().cuid(),
  parentId: z.string().cuid().optional(),
});
```

#### API Security Middleware

```typescript
// lib/auth/middleware.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return session;
}

export function requireRole(roles: Role[]) {
  return async (request: NextRequest) => {
    const session = await requireAuth(request);
    if (session instanceof NextResponse) return session;

    if (!roles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return session;
  };
}
```

---

## 🔄 Real-Time Features Architecture

### Server-Sent Events Implementation

#### Real-Time Service

```typescript
// lib/realtime/service.ts
class RealTimeService {
  private connections = new Map<string, Response>();

  addConnection(userId: string, response: Response) {
    this.connections.set(userId, response);
  }

  removeConnection(userId: string) {
    this.connections.delete(userId);
  }

  broadcast(event: string, data: any, userIds?: string[]) {
    const targetUsers = userIds || Array.from(this.connections.keys());

    targetUsers.forEach(userId => {
      const connection = this.connections.get(userId);
      if (connection) {
        this.sendEvent(connection, event, data);
      }
    });
  }

  private sendEvent(response: Response, event: string, data: any) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    response.write(message);
  }
}

export const realTimeService = new RealTimeService();
```

#### Real-Time Hooks

```typescript
// hooks/useRealTimeUpdates.ts
export function useRealTimeUpdates(entityType: string, entityId?: string) {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const url = entityId
      ? `/api/realtime/${entityType}?entityId=${entityId}`
      : `/api/realtime/${entityType}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = event => {
      const update = JSON.parse(event.data);
      setUpdates(prev => [...prev, update]);
    };

    return () => eventSource.close();
  }, [entityType, entityId]);

  return updates;
}
```

---

## 📱 Frontend Architecture Details

### Component Library Structure

#### Base UI Components

```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size]
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
```

#### Collaboration Components

```typescript
// components/collaboration/VotingButton.tsx
interface VotingButtonProps {
  entityId: string;
  entityType: 'INPUT' | 'SOLUTION' | 'REQUIREMENT';
  currentVote?: 'UP' | 'DOWN';
  voteCount: number;
  onVote: (voteType: 'UP' | 'DOWN') => Promise<void>;
}

export function VotingButton({ entityId, currentVote, voteCount, onVote }: VotingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: 'UP' | 'DOWN') => {
    setIsLoading(true);
    try {
      await onVote(voteType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentVote === 'UP' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => handleVote('UP')}
        disabled={isLoading}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <span className="font-medium">{voteCount}</span>
      <Button
        variant={currentVote === 'DOWN' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => handleVote('DOWN')}
        disabled={isLoading}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### State Management Architecture

#### Zustand Store Structure

```typescript
// stores/useInputStore.ts
interface InputStore {
  inputs: Input[];
  filters: InputFilters;
  selectedInput: Input | null;

  // Actions
  setInputs: (inputs: Input[]) => void;
  addInput: (input: Input) => void;
  updateInput: (id: string, updates: Partial<Input>) => void;
  setFilters: (filters: Partial<InputFilters>) => void;
  selectInput: (input: Input | null) => void;

  // Real-time updates
  handleRealTimeUpdate: (update: RealTimeUpdate) => void;
}

export const useInputStore = create<InputStore>((set, get) => ({
  inputs: [],
  filters: {},
  selectedInput: null,

  setInputs: inputs => set({ inputs }),
  addInput: input =>
    set(state => ({
      inputs: [input, ...state.inputs],
    })),
  updateInput: (id, updates) =>
    set(state => ({
      inputs: state.inputs.map(input =>
        input.id === id ? { ...input, ...updates } : input
      ),
    })),
  setFilters: filters =>
    set(state => ({
      filters: { ...state.filters, ...filters },
    })),
  selectInput: input => set({ selectedInput: input }),

  handleRealTimeUpdate: update => {
    const { type, data } = update;
    switch (type) {
      case 'INPUT_CREATED':
        get().addInput(data);
        break;
      case 'INPUT_UPDATED':
        get().updateInput(data.id, data);
        break;
      case 'VOTE_UPDATED':
        get().updateInput(data.inputId, { voteCount: data.newCount });
        break;
    }
  },
}));
```

---

## 🚀 Deployment & Infrastructure

### Vercel Configuration

#### Project Configuration

```javascript
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/ai/**/*.ts": {
      "maxDuration": 60
    },
    "src/app/api/documents/generate/route.ts": {
      "maxDuration": 300
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### Environment Configuration

```bash
# .env.local
# Database
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
OPENAI_API_KEY="sk-..."

# File Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Email
RESEND_API_KEY="re_..."

# Monitoring
SENTRY_DSN="https://..."
```

### CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
# .github/workflows/quality-check.yml
name: Quality Check
on:
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type checking
        run: npm run type-check

      - name: Linting
        run: npm run lint

      - name: Unit tests
        run: npm run test

      - name: E2E tests
        run: npm run test:e2e

      - name: Build verification
        run: npm run build

  deploy-preview:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

### Performance Monitoring

#### Monitoring Stack

```typescript
// lib/monitoring/setup.ts
import { withSentryConfig } from '@sentry/nextjs';

export default withSentryConfig(
  nextConfig,
  {
    org: 'your-org',
    project: 'faevision',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

---

## 🧪 Testing Architecture

### Testing Strategy

#### Unit Testing (Vitest)

```typescript
// __tests__/components/InputCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { InputCard } from '@/components/inputs/InputCard';

describe('InputCard', () => {
  const mockInput = {
    id: '1',
    title: 'Test Input',
    description: 'Test description',
    type: 'PROBLEM',
    status: 'NEW',
    voteCount: 5,
    commentCount: 3,
  };

  it('renders input information correctly', () => {
    render(<InputCard input={mockInput} onVote={jest.fn()} />);

    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // vote count
  });

  it('handles voting interactions', async () => {
    const onVote = jest.fn();
    render(<InputCard input={mockInput} onVote={onVote} />);

    fireEvent.click(screen.getByLabelText('Upvote'));
    expect(onVote).toHaveBeenCalledWith('1', 'UP');
  });
});
```

#### E2E Testing (Playwright)

```typescript
// tests/e2e/input-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Input Creation', () => {
  test('should create input with AI tagging', async ({ page }) => {
    await page.goto('/dashboard');

    // Click create input button
    await page.click('[data-testid="create-input-btn"]');

    // Fill form
    await page.fill(
      '[data-testid="input-title"]',
      'Network connectivity issue'
    );
    await page.fill(
      '[data-testid="input-description"]',
      'WiFi keeps dropping in conference room'
    );

    // Wait for AI tagging suggestions
    await expect(page.locator('[data-testid="ai-suggestions"]')).toBeVisible();

    // Submit form
    await page.click('[data-testid="submit-btn"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

---

## 📊 Performance Architecture

### Optimization Strategy

#### Frontend Performance

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['vercel.blob.store'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  webpack: config => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
};
```

#### Caching Strategy

```typescript
// lib/cache/strategy.ts
import { unstable_cache } from 'next/cache';

// Cache expensive database queries
export const getCachedInputs = unstable_cache(
  async (filters: InputFilters) => {
    return await prisma.input.findMany({
      where: buildWhereClause(filters),
      include: { user: true, votes: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  ['inputs'],
  { revalidate: 60, tags: ['inputs'] }
);

// Cache user permissions
export const getCachedUserPermissions = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return calculatePermissions(user);
  },
  ['user-permissions'],
  { revalidate: 300, tags: ['users'] }
);
```

---

## 🔧 Development Workflow

### Local Development Setup

#### Development Scripts

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
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

#### Development Environment

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  POSTGRES_PRISMA_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  BLOB_READ_WRITE_TOKEN: z.string(),
  RESEND_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
```

### Code Quality Configuration

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: { jest: true },
    },
  ],
};
```

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📈 Scalability & Future Considerations

### Scaling Strategy

#### Current Architecture Limits

- **Users**: 50 (well within Vercel Postgres limits)
- **Concurrent**: 20 active users (easily handled)
- **Storage**: 10GB (Vercel Blob supports much more)
- **Database**: 100MB+ (Vercel Postgres handles GB scale)

#### Future Scaling Options

1. **User Growth**: Vercel scales automatically to hundreds of users
2. **Database Growth**: Upgrade Vercel Postgres plan or migrate to dedicated
3. **Global Distribution**: Vercel edge functions for international expansion
4. **Advanced Features**: Add microservices as needed without architecture changes

### Migration Path

#### Phase 2 Enhancements

- **Advanced Analytics**: Add specialized analytics services
- **External Integrations**: Connect with existing business tools
- **Mobile Apps**: React Native with shared API
- **Enterprise Features**: SSO, advanced permissions, compliance tools

---

## 🎯 Implementation Timeline

### Week 1-2: Foundation Setup

- **Environment Setup**: Vercel project, GitHub integration, database
- **Authentication**: NextAuth.js configuration and user management
- **Base Components**: UI library and design system
- **Database Schema**: Prisma setup and initial migrations

### Week 3-4: Core Features

- **Input Management**: CRUD operations with real-time updates
- **Collaboration**: Voting and commenting systems
- **AI Integration**: Tagging and duplicate detection
- **Admin Panel**: User and system management

### Week 5-6: Advanced Features

- **Group Management**: Drag-and-drop organization with AI suggestions
- **Solution Management**: Task breakdown and progress tracking
- **Real-Time Optimization**: Performance tuning for collaboration features

### Week 7-8: Requirements System

- **Requirements CRUD**: Executive requirements management
- **Collaboration**: Voting and commenting on requirements
- **Approval Workflow**: Executive approval processes
- **AI Assistance**: Requirements generation from solution data

### Week 9-10: FRD Generation & Launch

- **Document Generation**: AI-powered FRD creation
- **Template System**: Professional document templates
- **Executive Review**: Document approval workflow
- **Production Deployment**: Final testing and go-live

---

## ✅ Expert Team Final Consensus

### Unanimous Agreement Statement

**All 11 experts unanimously agree** that this Vercel-first technology stack:

1. **Optimizes for Simplicity**: Minimal configuration and operational overhead
2. **Ensures Performance**: Meets all performance requirements with room to grow
3. **Enables Rapid Development**: Excellent developer experience with AI assistance
4. **Provides Enterprise Features**: Security, compliance, and reliability built-in
5. **Supports Future Growth**: Clear scaling path without architectural changes

### Individual Expert Sign-Off

- ✅ **Jordan Kim (Vercel Engineer)**: _"Perfect utilization of Vercel ecosystem for our requirements"_
- ✅ **Morgan Smith (Database Architect)**: _"Vercel Postgres provides everything we need with zero ops overhead"_
- ✅ **Dr. Priya Patel (AI Architect)**: _"Vercel AI SDK is purpose-built for our AI integration needs"_
- ✅ **Alex Thompson (Lead Developer)**: _"Excellent developer experience enabling quality delivery"_
- ✅ **Jordan Lee (Cursor Expert)**: _"Optimal stack for AI-assisted development productivity"_
- ✅ **Taylor Morgan (GitHub Expert)**: _"Seamless CI/CD and quality assurance integration"_
- ✅ **Alex Johnson (Linear Expert)**: _"Simple stack reduces project complexity and risk"_
- ✅ **Maya Rodriguez (IA/UX Expert)**: _"Next.js provides excellent foundation for responsive, accessible design"_
- ✅ **David Chen (Visual Designer)**: _"Tailwind + Headless UI enables rapid, consistent design implementation"_
- ✅ **Sarah Chen (Product Manager)**: _"Stack optimizes for speed to market and minimal operational burden"_
- ✅ **Marcus Rodriguez (Strategic Consultant)**: _"Enterprise-grade capabilities without enterprise complexity"_

---

## 🏆 Final Architecture Summary

**FAEVision MVP Technical Architecture** represents the unanimous consensus of 11 specialized experts on a **Vercel-first technology stack** that:

### ✅ Delivers Technical Excellence

- Modern, type-safe development with Next.js 14 + TypeScript
- Managed PostgreSQL with Prisma for data integrity
- Real-time collaboration with Server-Sent Events
- Comprehensive AI integration with Vercel AI SDK

### ✅ Ensures Operational Simplicity

- Zero infrastructure management with Vercel platform
- Automatic scaling and performance optimization
- Built-in monitoring, analytics, and error tracking
- Seamless CI/CD with GitHub integration

### ✅ Optimizes for Development Velocity

- AI-assisted development with Cursor integration
- Excellent developer experience with modern tooling
- Rapid UI development with Tailwind CSS
- Comprehensive testing with Vitest and Playwright

### ✅ Enables Future Growth

- Scalable architecture supporting growth to hundreds of users
- Clear migration path for advanced features
- Integration-ready for external systems
- Enterprise-grade security and compliance foundation

---

**Document Status**: ✅ **APPROVED FOR IMPLEMENTATION**  
**Next Phase**: Detailed technical design and development sprint planning  
**Team Commitment**: All 11 experts committed to successful implementation with chosen stack

---

_This document represents the final, unanimous consensus of the FAEVision expert team on the optimal technology stack for MVP development and deployment._
