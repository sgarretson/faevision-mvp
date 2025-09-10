#!/usr/bin/env node

/**
 * Cursor MCP Activation Guide - Interactive Setup
 * Expert: Jordan Lee (Cursor Expert)
 * 
 * Interactive guide for activating Linear MCP in Cursor IDE
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🎯 Cursor Linear MCP Activation - Jordan Lee's Interactive Guide
══════════════════════════════════════════════════════════════════════════

Expert: Jordan Lee (Cursor Expert)
Task: Activate Linear MCP in Cursor IDE for FAEVision MVP
Epic: Epic 0 - Environment & Tools Setup

🚀 IMMEDIATE ACTIVATION STEPS
══════════════════════════════════════════════════════════════════════════

Step 1: Open Cursor IDE
─────────────────────────────
1. Launch Cursor IDE on your system
2. Ensure you're in the FAEVision project directory
3. Confirm the project is loaded properly

Step 2: Install MCP Extension
───────────────────────────────
1. Press Cmd/Ctrl + Shift + X (Extensions)
2. Search for "MCP" or "Model Context Protocol"
3. Install the official MCP extension
4. If not found, try searching for "Linear MCP" or "mcp-remote"

Alternative Installation Methods:
- Extensions marketplace: Search "Model Context Protocol"
- Command palette (Cmd/Ctrl + Shift + P): "Install Extensions"
- VS Code marketplace: Install MCP-compatible extensions

Step 3: Configure Linear MCP Server
─────────────────────────────────────
1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Search for "MCP" in settings
3. Look for "MCP Servers" or "Model Context Protocol"
4. Add server configuration using our .cursor/mcp-servers.json

Configuration to add:
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse"]
    }
  }
}

Step 4: Restart Cursor
────────────────────────
1. Restart Cursor IDE completely
2. Reopen FAEVision project
3. Check for MCP status in status bar or settings

🧪 TESTING LINEAR MCP INTEGRATION
══════════════════════════════════════════════════════════════════════════
`);

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.toLowerCase().trim());
        });
    });
}

async function runActivationGuide() {
    try {
        console.log(`\nLet's validate your Cursor MCP setup step by step...\n`);

        // Step 1: Cursor IDE Check
        const cursorOpen = await askQuestion('1. Is Cursor IDE currently open? (y/n): ');
        if (cursorOpen !== 'y') {
            console.log(`\n⏳ Please open Cursor IDE and return here when ready.\n`);
            return;
        }

        // Step 2: Extensions Check
        const extensionsOpen = await askQuestion('2. Can you access Extensions (Cmd/Ctrl + Shift + X)? (y/n): ');
        if (extensionsOpen === 'y') {
            console.log(`\n✅ Great! Now search for "MCP" in the extensions marketplace.`);
            
            const mcpFound = await askQuestion('3. Do you see MCP or Model Context Protocol extensions? (y/n): ');
            if (mcpFound === 'y') {
                console.log(`\n✅ Perfect! Install the MCP extension and continue.`);
            } else {
                console.log(`\n⚠️  MCP extension not found. Let's try manual configuration...`);
                console.log(`\nAlternative: Configure MCP manually in Cursor settings.`);
            }
        }

        // Step 3: Settings Configuration
        const settingsAccess = await askQuestion('4. Can you access Cursor Settings (Cmd/Ctrl + ,)? (y/n): ');
        if (settingsAccess === 'y') {
            console.log(`\n✅ Great! Search for "MCP" in settings.`);
            
            const mcpSettings = await askQuestion('5. Do you see MCP or Model Context Protocol settings? (y/n): ');
            if (mcpSettings === 'y') {
                console.log(`\n✅ Excellent! Add the Linear MCP server configuration:`);
                console.log(`
Configuration to add:
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse"]
    }
  }
}
                `);
            } else {
                console.log(`\n⚠️  MCP settings not found. This might indicate:`);
                console.log(`   - MCP extension not installed yet`);
                console.log(`   - Different settings location in your Cursor version`);
                console.log(`   - Need to restart Cursor after extension install`);
            }
        }

        // Step 4: Restart and Test
        const restartReady = await askQuestion('6. Ready to restart Cursor and test? (y/n): ');
        if (restartReady === 'y') {
            console.log(`\n🔄 After restarting Cursor:`);
            console.log(`1. Open FAEVision project`);
            console.log(`2. Open Cursor chat/compose`);
            console.log(`3. Try: "Can you access Linear?"`);
            console.log(`4. Test: "Show me my Linear workspace"`);
            
            const testingDone = await askQuestion('7. Have you completed the restart and testing? (y/n): ');
            if (testingDone === 'y') {
                const integrationWorking = await askQuestion('8. Is the Linear MCP integration working? (y/n): ');
                if (integrationWorking === 'y') {
                    console.log(`\n🎉 SUCCESS! Linear MCP integration is active!`);
                    console.log(`\n✅ Jordan Lee's Cursor Expert setup complete!`);
                    console.log(`✅ Advanced AI-Linear workflow operational!`);
                    console.log(`✅ Epic 0 infrastructure 100% complete!`);
                    console.log(`\n🚀 Ready for Epic 1: Foundation & Authentication development!`);
                } else {
                    console.log(`\n🔧 Integration needs troubleshooting. Let's check common issues...`);
                    await troubleshootIntegration();
                }
            }
        }

    } catch (error) {
        console.log(`\n❌ Error during activation: ${error.message}`);
        console.log(`\nTroubleshooting resources:`);
        console.log(`- docs/integrations/Linear-MCP-Integration-Guide.md`);
        console.log(`- CURSOR-LINEAR-MCP-SETUP-COMPLETE.md`);
    } finally {
        rl.close();
    }
}

async function troubleshootIntegration() {
    console.log(`\n🔧 TROUBLESHOOTING LINEAR MCP INTEGRATION`);
    console.log(`════════════════════════════════════════════════════════════════`);
    
    const issueType = await askQuestion(`
Common issues:
a) Authentication/OAuth flow failed
b) MCP extension not properly installed  
c) Configuration not loaded correctly
d) Network/firewall blocking connection
e) Linear token expired or invalid

Which issue sounds most likely? (a/b/c/d/e): `);

    switch (issueType) {
        case 'a':
            console.log(`\n🔑 Authentication Issue:`);
            console.log(`1. Check .env.local has valid LINEAR_TOKEN`);
            console.log(`2. Try OAuth flow again in browser`);
            console.log(`3. Clear auth cache: rm -rf ~/.mcp-auth`);
            break;
        case 'b':
            console.log(`\n📦 Extension Issue:`);
            console.log(`1. Verify MCP extension is installed and enabled`);
            console.log(`2. Try alternative extension names`);
            console.log(`3. Check Cursor version compatibility`);
            break;
        case 'c':
            console.log(`\n⚙️  Configuration Issue:`);
            console.log(`1. Verify .cursor/mcp-servers.json exists`);
            console.log(`2. Check settings syntax is correct`);
            console.log(`3. Restart Cursor completely`);
            break;
        case 'd':
            console.log(`\n🌐 Network Issue:`);
            console.log(`1. Check internet connectivity`);
            console.log(`2. Verify https://mcp.linear.app/sse is accessible`);
            console.log(`3. Check firewall/proxy settings`);
            break;
        case 'e':
            console.log(`\n🔄 Token Issue:`);
            console.log(`1. Generate new Linear API token`);
            console.log(`2. Update .env.local with new token`);
            console.log(`3. Restart integration`);
            break;
        default:
            console.log(`\n📚 General troubleshooting:`);
            console.log(`1. Check all setup documentation`);
            console.log(`2. Verify Node.js and npm versions`);
            console.log(`3. Try manual mcp-remote test`);
    }
    
    console.log(`\n📞 For additional support:`);
    console.log(`- Linear MCP docs: https://linear.app/docs/mcp`);
    console.log(`- FAEVision setup guides in docs/integrations/`);
}

console.log(`\n🎯 Starting interactive activation guide...`);
runActivationGuide();

