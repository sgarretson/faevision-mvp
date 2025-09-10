#!/usr/bin/env node

/**
 * FAEVision Linear Workspace Setup Script
 * Expert: Alex Johnson (Linear Expert)
 * 
 * This script implements the complete Linear workspace configuration
 * as documented in linear-workspace-setup/linear-workspace-config.yaml
 */

const fs = require('fs');
const path = require('path');

class FAEVisionLinearSetup {
  constructor() {
    this.configPath = path.join(__dirname, '../linear-workspace-setup/linear-workspace-config.yaml');
    this.workspaceName = 'FAEVision MVP';
    this.description = 'Internal application for 50 executives - 11-week delivery';
  }

  displaySetupInstructions() {
    console.log('\n🎯 FAEVision Linear Workspace Setup Guide');
    console.log('Expert: Alex Johnson (Linear Expert)');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('Following our documented Linear Expert process, please complete these steps:\n');
    
    console.log('📋 STEP 1: Create Linear Account & Workspace');
    console.log('1. Go to https://linear.app');
    console.log('2. Sign up or log in with your account');
    console.log('3. Create new workspace: "FAEVision MVP"');
    console.log('4. Description: "Internal application for 50 executives - 11-week delivery"\n');
    
    console.log('🔑 STEP 2: Generate API Token');
    console.log('1. Go to Linear Settings → API');
    console.log('2. Create new API token with name: "FAEVision-CLI-Token"');
    console.log('3. Copy the token (starts with lin_api_...)\n');
    
    console.log('⚙️  STEP 3: Configure Local Environment');
    console.log('1. Create .env.local file in project root');
    console.log('2. Add: LINEAR_TOKEN=your_token_here');
    console.log('3. Add: LINEAR_WORKSPACE_ID=your_workspace_id\n');
    
    this.displayTeamStructure();
    this.displayCustomFields();
    this.displayEpicStructure();
  }

  displayTeamStructure() {
    console.log('👥 STEP 4: Create Team Structure');
    console.log('Create these teams in Linear with specified members:\n');
    
    const teams = {
      'Core Development': [
        'Alex Thompson (Lead Developer)',
        'Jordan Lee (Cursor Expert)', 
        'Taylor Morgan (GitHub Expert)',
        'Morgan Smith (Database Architect)'
      ],
      'Product & Strategy': [
        'Sarah Chen (Product Manager)',
        'Marcus Rodriguez (Strategic Consultant)',
        'Alex Johnson (Linear Expert)'
      ],
      'Design & UX': [
        'Maya Rodriguez (UX Expert)',
        'David Chen (Visual Designer)',
        'Dr. Priya Patel (AI Architect)'
      ],
      'Platform & Infrastructure': [
        'Jordan Kim (Vercel Engineer)',
        'Taylor Morgan (GitHub Expert)',
        'Morgan Smith (Database Architect)'
      ]
    };

    Object.entries(teams).forEach(([teamName, members]) => {
      console.log(`📁 ${teamName}:`);
      members.forEach(member => console.log(`   • ${member}`));
      console.log('');
    });
  }

  displayCustomFields() {
    console.log('🏷️  STEP 5: Configure Custom Fields');
    console.log('Add these custom fields to your Linear workspace:\n');
    
    const customFields = [
      {
        name: 'Business Impact',
        type: 'Select',
        options: ['High', 'Medium', 'Low'],
        description: 'Business value and priority assessment'
      },
      {
        name: 'User Role Affected', 
        type: 'Multi-select',
        options: ['Admin', 'Executive', 'Contributor', 'All'],
        description: 'Which user roles are impacted by this work'
      },
      {
        name: 'Technical Complexity',
        type: 'Select', 
        options: ['Simple', 'Medium', 'Complex', 'Research Required'],
        description: 'Development complexity estimation'
      },
      {
        name: 'AI Component',
        type: 'Boolean',
        description: 'Does this work involve AI features or integration'
      },
      {
        name: 'Executive Review Required',
        type: 'Boolean',
        description: 'Requires executive stakeholder review and approval'
      }
    ];

    customFields.forEach(field => {
      console.log(`• ${field.name} (${field.type})`);
      if (field.options) {
        console.log(`  Options: ${field.options.join(', ')}`);
      }
      console.log(`  ${field.description}\n`);
    });
  }

  displayEpicStructure() {
    console.log('🗺️  STEP 6: Create Epic Structure');
    console.log('Create these Epics in Linear with 2-week cycles:\n');
    
    const epics = [
      'Epic 0: Environment & Tools Setup (Week 0)',
      'Epic 1: Foundation & Authentication (Weeks 1-2)', 
      'Epic 2: Input Management System (Weeks 3-4)',
      'Epic 3: Collaboration Features (Weeks 5-6)',
      'Epic 4: Organization & Solutions (Weeks 7-8)',
      'Epic 5: Requirements System (Weeks 9-10)',
      'Epic 6: FRD Generation & Launch (Week 11)'
    ];

    epics.forEach((epic, index) => {
      console.log(`${index + 1}. ${epic}`);
    });
    
    console.log('\n📝 STEP 7: Create Epic 0 Master Issue');
    console.log('1. Create issue: "FAE-001 - Epic 0: Environment & Tools Setup"');
    console.log('2. Set as Epic type');
    console.log('3. Assign to Epic 0');
    console.log('4. Add description from: linear-workspace-setup/epic-0-master-issue.md');
    console.log('5. Create sub-issues for each expert (FAE-002 through FAE-012)');
  }

  displayIntegrationSetup() {
    console.log('\n🔗 STEP 8: Configure Integrations');
    console.log('Set up these integrations in Linear:\n');
    
    console.log('• GitHub Integration:');
    console.log('  - Connect to: https://github.com/sgarretson/faevision-mvp');
    console.log('  - Enable automatic issue/PR linking');
    console.log('  - Configure branch naming: feature/FAE-{issue-number}-{description}');
    console.log('');
    
    console.log('• Vercel Integration:');
    console.log('  - Connect to FAEVision Vercel project');
    console.log('  - Enable deployment status updates');
    console.log('  - Configure environment tracking\n');
  }

  displayCLICommands() {
    console.log('🛠️  STEP 9: Test CLI Commands');
    console.log('After setting up LINEAR_TOKEN, test these commands:\n');
    
    console.log('# List workspace info');
    console.log('npx linear-cli teams\n');
    
    console.log('# Create Epic 0 master issue');
    console.log('npx linear-cli issue create \\');
    console.log('  --title "FAE-001 - Epic 0: Environment & Tools Setup" \\');
    console.log('  --description "Complete development environment setup" \\');
    console.log('  --priority high\n');
    
    console.log('# List current issues');
    console.log('npx linear-cli issues\n');
  }

  displayCompletionValidation() {
    console.log('✅ STEP 10: Validation Checklist');
    console.log('Confirm these items are complete:\n');
    
    const checklist = [
      'Linear workspace "FAEVision MVP" created',
      'All 4 teams created with proper member assignments', 
      'All 5 custom fields configured',
      'Epic 0-6 structure created',
      'FAE-001 master issue created with sub-issues',
      'GitHub integration connected and tested',
      'Vercel integration connected and tested',
      'LINEAR_TOKEN environment variable configured',
      'CLI commands working (npx linear-cli teams)',
      'All 11 experts invited to workspace'
    ];

    checklist.forEach((item, index) => {
      console.log(`${index + 1}. [ ] ${item}`);
    });
    
    console.log('\n🎉 Once complete, Epic 0 will be 100% compliant!');
    console.log('All 11 experts will have full project management access.');
  }

  run() {
    console.clear();
    this.displaySetupInstructions();
    this.displayIntegrationSetup();
    this.displayCLICommands();
    this.displayCompletionValidation();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📚 Reference Documents:');
    console.log('• linear-workspace-setup/linear-workspace-config.yaml');
    console.log('• linear-workspace-setup/epic-0-master-issue.md');
    console.log('• experts/09_linear_expert.md');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

// Run the setup guide
new FAEVisionLinearSetup().run();
