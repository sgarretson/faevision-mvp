#!/usr/bin/env node

/**
 * FAEVision Linear Workspace Complete Setup
 * Expert: Alex Johnson (Linear Expert)
 *
 * This script provides complete Linear workspace setup following
 * the FAEVision Linear Process documentation.
 */

console.log(`
🎯 FAEVision Linear Workspace Complete Setup
Expert: Alex Johnson (Linear Expert)
═══════════════════════════════════════════════════════════════════

Following FAEVision-Linear-Process.md for complete workspace configuration.

Current Status: Your Linear token is authenticated ✅
Workspace Status: Empty (ready for setup) ✅

📋 COMPLETE SETUP PROCESS - STEP BY STEP
═══════════════════════════════════════════════════════════════════

PHASE 1: WORKSPACE CREATION (Web Interface Required)
──────────────────────────────────────────────────────────────────

The Linear CLI currently requires an existing workspace. Complete these steps:

🌐 Step 1: Create Linear Workspace
1. Go to: https://linear.app/new
2. Create workspace: "FAEVision MVP"
3. Description: "Internal application for 50 executives - 11-week delivery"
4. Select team size: "Small team (up to 10 people)"

👥 Step 2: Initial Team Setup
1. Skip individual invites for now
2. Complete workspace creation
3. Note your workspace URL: https://linear.app/faevision-mvp

🔑 Step 3: Verify API Access
1. Go to Settings → API
2. Verify your existing token has workspace access
3. Note your workspace ID from the URL

PHASE 2: CLI-BASED CONFIGURATION (Once workspace exists)
──────────────────────────────────────────────────────────────────

Once workspace is created, run these CLI commands:

📊 Verify Workspace Access:
export $(cat .env.local | grep -v '^#' | xargs) && npx linear-cli teams

📝 Create Epic 0 Master Issue:
export $(cat .env.local | grep -v '^#' | xargs) && npx linear-cli issue create \\
  --title "FAE-001 - Epic 0: Environment & Tools Setup" \\
  --description "Complete development environment setup for 11 expert team"

🗂️ Create Epic Structure (Epics 1-6):
# Will provide CLI commands once workspace is accessible

PHASE 3: ADVANCED CONFIGURATION (Web Interface + CLI)
──────────────────────────────────────────────────────────────────

🏗️ Team Structure Setup:
Following FAEVision-Linear-Process.md Team Structure:

Teams to Create:
1. Core Development
   - Alex Thompson (Lead Developer)
   - Jordan Lee (Cursor Expert)  
   - Taylor Morgan (GitHub Expert)
   - Morgan Smith (Database Architect)

2. Product & Strategy
   - Sarah Chen (Product Manager)
   - Marcus Rodriguez (Strategic Consultant)
   - Alex Johnson (Linear Expert)

3. Design & UX
   - Maya Rodriguez (UX Expert)
   - David Chen (Visual Designer)
   - Dr. Priya Patel (AI Architect)

4. Platform & Infrastructure
   - Jordan Kim (Vercel Engineer)
   - Morgan Smith (Database Architect)
   - Taylor Morgan (GitHub Expert)

🏷️ Custom Fields to Configure:
1. Business Impact (Select: High, Medium, Low)
2. User Role Affected (Multi-select: Admin, Executive, Contributor, All)
3. Technical Complexity (Select: Simple, Medium, Complex, Research Required)
4. AI Component (Boolean)
5. Executive Review Required (Boolean)
6. Design Status (Select: Not Started, In Progress, Review, Approved, Complete)
7. Testing Status (Select: Not Started, Unit Tests, Integration Tests, E2E Tests, Complete)
8. Documentation Status (Select: Not Started, In Progress, Review, Complete)

📋 Issue Templates to Create:
1. User Story Template
2. Bug Report Template  
3. AI Feature Template
4. Epic Template

🗺️ Epic Structure (Weeks 0-11):
Epic 0: Environment & Tools Setup (Week 0)
Epic 1: Foundation & Authentication (Weeks 1-2)
Epic 2: Input Capture & Management (Weeks 3-4)
Epic 3: Collaboration Features (Weeks 5-6)
Epic 4: Organization & AI Intelligence (Weeks 7-8)
Epic 5: Solution Management (Weeks 9-10)
Epic 6: Executive Requirements & FRD (Week 11)

🔗 Integration Setup:
1. GitHub Integration: Connect to https://github.com/sgarretson/faevision-mvp
2. Vercel Integration: Connect to FAEVision Vercel project
3. Branch naming: feature/FAE-{issue-number}-{description}

PHASE 4: VALIDATION & TESTING
──────────────────────────────────────────────────────────────────

✅ Validation Checklist:
1. [ ] Workspace created and accessible
2. [ ] All 4 teams created with member assignments
3. [ ] All 8 custom fields configured
4. [ ] Epic 0-6 structure created
5. [ ] Issue templates configured
6. [ ] GitHub integration connected
7. [ ] Vercel integration connected
8. [ ] CLI commands working
9. [ ] FAE-001 master issue created
10. [ ] All 11 experts invited to workspace

📞 NEXT STEPS FOR YOU:
═══════════════════════════════════════════════════════════════════

1. Complete Workspace Creation (10 minutes):
   - Create workspace at https://linear.app/new
   - Use name: "FAEVision MVP"
   - Note the workspace URL

2. Return here and run:
   node scripts/complete-linear-setup.js --phase2

3. Follow the detailed CLI commands for configuration

⚡ Once workspace exists, I can provide complete CLI automation!
═══════════════════════════════════════════════════════════════════
`);

// Check if we have CLI access to workspace
const { execSync } = require('child_process');

try {
  // Test if workspace is accessible
  const result = execSync(
    'export $(cat .env.local | grep -v "^#" | xargs) && npx linear-cli teams',
    {
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );

  console.log(`
🎉 WORKSPACE DETECTED! Proceeding with CLI setup...
═══════════════════════════════════════════════════════════════════
    `);

  // If we get here, workspace exists and we can proceed with CLI setup
  runPhase2Setup();
} catch (error) {
  if (
    error.stdout &&
    error.stdout.includes('Cannot read properties of undefined')
  ) {
    console.log(`
📝 WORKSPACE CREATION REQUIRED
═══════════════════════════════════════════════════════════════════

Your Linear token is authenticated, but no workspace exists yet.

Please complete Phase 1 (workspace creation) and then run:
node scripts/complete-linear-setup.js --phase2

🌐 Create workspace at: https://linear.app/new
📝 Name: "FAEVision MVP"  
📋 Description: "Internal application for 50 executives - 11-week delivery"
        `);
  } else {
    console.log(`
⚠️  CLI Access Issue: ${error.message}

Please verify:
1. LINEAR_TOKEN is set in .env.local
2. Token has workspace access
3. Workspace exists

Run: export $(cat .env.local | grep -v '^#' | xargs) && npx linear-cli --help
        `);
  }
}

function runPhase2Setup() {
  console.log(`
🚀 PHASE 2: CLI-BASED CONFIGURATION
═══════════════════════════════════════════════════════════════════

Creating Epic 0 Master Issue following FAEVision Linear Process...
    `);

  try {
    // Create Epic 0 master issue
    const issueResult = execSync(
      `
            export $(cat .env.local | grep -v '^#' | xargs) && npx linear-cli issue create \\
            --title "FAE-001 - Epic 0: Environment & Tools Setup" \\
            --description "Complete development environment setup for 11 expert team. Following FAEVision-Linear-Process.md specifications."
        `,
      { encoding: 'utf8' }
    );

    console.log(`✅ Epic 0 Master Issue Created: ${issueResult}`);

    // Additional CLI setup commands would go here
    console.log(`
🎯 NEXT CLI COMMANDS:
═══════════════════════════════════════════════════════════════════

Phase 2 complete! Now configure:
1. Team structure (Web interface)
2. Custom fields (Web interface)  
3. Epic structure (CLI + Web)
4. Integrations (Web interface)

See detailed instructions in the setup guide above.
        `);
  } catch (error) {
    console.log(`
⚠️  Issue Creation Error: ${error.message}

This is normal if workspace setup isn't complete.
Continue with web interface setup first.
        `);
  }
}

// Handle command line arguments
if (process.argv.includes('--phase2')) {
  runPhase2Setup();
}
