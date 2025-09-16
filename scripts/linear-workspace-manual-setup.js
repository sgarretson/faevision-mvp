#!/usr/bin/env node

/**
 * FAEVision Linear Workspace Manual Setup Guide
 * Expert: Alex Johnson (Linear Expert)
 *
 * Complete step-by-step guide for setting up Linear workspace
 * following FAEVision-Linear-Process.md specifications
 */

console.log(`
🎯 FAEVision Linear Workspace Complete Setup Guide
Expert: Alex Johnson (Linear Expert)
═══════════════════════════════════════════════════════════════════

Following FAEVision-Linear-Process.md for complete workspace configuration.

Current Status Analysis:
✅ Linear API token authenticated
✅ CLI connectivity confirmed  
🔄 Workspace creation required (CLI is read-only)

🌐 PHASE 1: WORKSPACE CREATION (Required First)
═══════════════════════════════════════════════════════════════════

Step 1: Create FAEVision Workspace
1. Open: https://linear.app/new
2. Workspace name: "FAEVision MVP"
3. Description: "Internal application for 50 executives - 11-week delivery"
4. Team size: "Small team (up to 20 people)"
5. Complete setup

Step 2: Configure Workspace Settings  
1. Go to Settings → General
2. Issue ID format: "FAE-{number}"
3. Start of week: Monday
4. Time zone: [Your organization timezone]

👥 PHASE 2: TEAM STRUCTURE SETUP
═══════════════════════════════════════════════════════════════════

Create 4 Teams Following FAEVision Process:

Team 1: Core Development
────────────────────────────
Members:
• Alex Thompson (Lead Developer) - Team Lead
• Jordan Lee (Cursor Expert)
• Taylor Morgan (GitHub Expert)  
• Morgan Smith (Database Architect)

Team 2: Product & Strategy
─────────────────────────────
Members:
• Sarah Chen (Product Manager) - Team Lead
• Marcus Rodriguez (Strategic Consultant)
• Alex Johnson (Linear Expert)

Team 3: Design & UX
──────────────────────
Members:
• Maya Rodriguez (UX Expert) - Team Lead
• David Chen (Visual Designer)
• Dr. Priya Patel (AI Architect)

Team 4: Platform & Infrastructure
─────────────────────────────────────
Members:
• Jordan Kim (Vercel Engineer) - Team Lead
• Morgan Smith (Database Architect)
• Taylor Morgan (GitHub Expert)

🏷️ PHASE 3: CUSTOM FIELDS CONFIGURATION
═══════════════════════════════════════════════════════════════════

Go to Settings → Custom Fields and create:

1. Business Impact
   Type: Select
   Options: High, Medium, Low
   Description: "Business value and priority assessment"

2. User Role Affected  
   Type: Multi-select
   Options: Admin, Executive, Contributor, All
   Description: "Which user roles are impacted by this work"

3. Technical Complexity
   Type: Select
   Options: Simple, Medium, Complex, Research Required
   Description: "Development complexity estimation"

4. AI Component
   Type: Boolean
   Description: "Does this work involve AI features or integration"

5. Executive Review Required
   Type: Boolean
   Description: "Requires executive stakeholder review and approval"

6. Design Status
   Type: Select
   Options: Not Started, In Progress, Review, Approved, Complete
   Description: "Design implementation status"

7. Testing Status
   Type: Select
   Options: Not Started, Unit Tests, Integration Tests, E2E Tests, Complete
   Description: "Testing completion status"

8. Documentation Status
   Type: Select
   Options: Not Started, In Progress, Review, Complete
   Description: "Documentation completion status"

📋 PHASE 4: ISSUE TEMPLATES
═══════════════════════════════════════════════════════════════════

Go to Settings → Issue Templates and create:

Template 1: User Story
─────────────────────────
## User Story
As a [user role], I want to [action/goal] so that [benefit/outcome].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Requirements
- [ ] Frontend implementation
- [ ] Backend API
- [ ] Database changes
- [ ] Testing coverage

## Definition of Done
- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Design implementation validated
- [ ] Documentation updated
- [ ] Deployed to staging

Template 2: Bug Report
─────────────────────────
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected vs Actual Behavior
**Expected**: What should happen
**Actual**: What actually happens

## Environment
- Browser: 
- Device: 
- User Role:
- URL:

## Priority Assessment
- [ ] Critical: Blocks MVP delivery
- [ ] High: Impacts user experience
- [ ] Medium: Minor functionality issue
- [ ] Low: Cosmetic or edge case

Template 3: AI Feature
─────────────────────────
## AI Feature Description
Description of AI functionality to implement

## AI Requirements
- **Model**: GPT-4 / GPT-3.5-turbo / Custom
- **Input**: Data format and structure
- **Output**: Expected AI response format
- **Confidence**: Minimum confidence threshold
- **Fallback**: Behavior when AI unavailable

## Quality Validation
- [ ] Accuracy testing (>80% acceptance)
- [ ] Performance testing (<15s processing)
- [ ] Fallback testing (graceful degradation)
- [ ] User feedback integration

🗺️ PHASE 5: EPIC STRUCTURE CREATION
═══════════════════════════════════════════════════════════════════

Create Projects/Epics in this order:

Epic 0: Environment & Tools Setup
─────────────────────────────────────
Timeline: Week 0
Description: Complete development environment setup for 11 expert team
Key Deliverables:
- Linear workspace operational with all integrations
- GitHub repository with complete CI/CD pipeline
- Cursor development environment configured
- Vercel environments (dev/staging/prod) ready
- Database provisioning and migration pipeline
- All experts trained and ready

Epic 1: Foundation & Authentication
──────────────────────────────────────
Timeline: Weeks 1-2
Description: Core application infrastructure and authentication
Key Deliverables:
- Working authentication system
- Database schema and migrations
- Basic component library
- Application foundation and routing

Epic 2: Input Capture & Management
─────────────────────────────────────
Timeline: Weeks 3-4
Description: Core input creation, tagging, and management features
Key Deliverables:
- Complete input creation workflow
- AI tagging and duplicate detection
- Input management interface
- Mobile-optimized capture

Epic 3: Collaboration Features
────────────────────────────────
Timeline: Weeks 5-6
Description: Real-time voting, commenting, and notification systems
Key Deliverables:
- Real-time voting and commenting
- Comprehensive notification system
- Activity feeds and engagement
- Cross-device collaboration

Epic 4: Organization & AI Intelligence
─────────────────────────────────────────
Timeline: Weeks 7-8
Description: Group management, AI suggestions, intelligent organization
Key Deliverables:
- Group management system
- AI suggestion engine
- Executive analytics dashboard
- Intelligent organization tools

Epic 5: Solution Management
─────────────────────────────
Timeline: Weeks 9-10
Description: Solution creation, task management, progress tracking
Key Deliverables:
- Complete solution workflow
- Task management system
- Progress tracking dashboard
- Solution collaboration features

Epic 6: Executive Requirements & FRD
───────────────────────────────────────
Timeline: Week 11
Description: Executive requirements management and AI-powered FRD generation
Key Deliverables:
- Requirements management system
- AI document generation
- Executive review workflow
- Document export and distribution

🔗 PHASE 6: INTEGRATIONS SETUP
═══════════════════════════════════════════════════════════════════

GitHub Integration:
1. Go to Settings → Integrations
2. Connect GitHub
3. Repository: https://github.com/sgarretson/faevision-mvp
4. Enable automatic issue/PR linking
5. Configure branch naming: feature/FAE-{issue-number}-{description}

Vercel Integration:
1. Go to Settings → Integrations  
2. Connect Vercel
3. Project: FAEVision MVP
4. Enable deployment status updates
5. Configure environment tracking

🎯 PHASE 7: CREATE EPIC 0 MASTER ISSUE
═══════════════════════════════════════════════════════════════════

Create the first issue:
1. Click "New Issue"
2. Title: "FAE-001 - Epic 0: Environment & Tools Setup"
3. Type: Epic
4. Project: Epic 0
5. Description: "Complete development environment setup for 11 expert team following FAEVision-Linear-Process.md"
6. Assign to: Alex Johnson (Linear Expert)
7. Custom Fields:
   - Business Impact: High
   - Technical Complexity: Complex
   - Executive Review Required: Yes

✅ PHASE 8: VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════════

Verify these items are complete:

Workspace Setup:
- [ ] FAEVision MVP workspace created
- [ ] Issue ID format set to FAE-{number}
- [ ] General settings configured

Team Structure:
- [ ] Core Development team created (4 members)
- [ ] Product & Strategy team created (3 members)
- [ ] Design & UX team created (3 members)
- [ ] Platform & Infrastructure team created (3 members)

Configuration:
- [ ] 8 custom fields created and configured
- [ ] 3 issue templates created (User Story, Bug, AI Feature)
- [ ] Epic 0-6 structure created with proper timelines

Integrations:
- [ ] GitHub integration connected and tested
- [ ] Vercel integration connected and tested
- [ ] Branch naming convention configured

Issues:
- [ ] FAE-001 Epic 0 master issue created
- [ ] All custom fields populated correctly
- [ ] Epic assignments and timelines set

📊 PHASE 9: CLI VALIDATION
═══════════════════════════════════════════════════════════════════

Once workspace is set up, test CLI access:

export $(cat .env.local | grep -v '^#' | xargs) && npx linear-cli cycle
# Should show Epic 0 and any created issues

export $(cat .env.local | grep -v '^#' | xargs) && npx linear-cli issue
# Should show issue details when issue ID provided

🎉 COMPLETION STATUS
═══════════════════════════════════════════════════════════════════

Once all phases are complete:
✅ Linear workspace fully configured
✅ 11 expert team structure established  
✅ Epic 0-6 project roadmap created
✅ GitHub and Vercel integrations active
✅ Ready for Epic 1 development to begin

📞 SUPPORT: If you need assistance with any step, reference:
- FAEVision-Linear-Process.md (complete process documentation)
- Alex Johnson Linear Expert profile (experts/09_linear_expert.md)
- Linear workspace setup config (linear-workspace-setup/)

Total Setup Time: ~45-60 minutes
Next Step: Begin Epic 1 development with full project management infrastructure
═══════════════════════════════════════════════════════════════════
`);

console.log(`\n🎯 READY TO PROCEED!\n`);
console.log(`Your Linear token is authenticated and ready.`);
console.log(
  `Follow the step-by-step guide above to create the complete FAEVision workspace.`
);
console.log(
  `\nOnce complete, Epic 0 will be 100% finished and ready for Epic 1 development!\n`
);
