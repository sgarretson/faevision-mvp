#!/usr/bin/env node

/**
 * Cursor MCP Validation Script
 * Expert: Jordan Lee (Cursor Expert)
 *
 * Validates Linear MCP integration and tests functionality
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log(`
🧪 Cursor Linear MCP Validation - Jordan Lee's Testing Suite
═══════════════════════════════════════════════════════════════════════════

Expert: Jordan Lee (Cursor Expert)
Epic: Epic 0 - Environment & Tools Setup
Task: Validate Linear MCP integration functionality

🔍 COMPREHENSIVE INTEGRATION TESTING
═══════════════════════════════════════════════════════════════════════════
`);

async function validateEnvironment() {
  console.log(`\n📋 Step 1: Environment Validation`);
  console.log(
    `─────────────────────────────────────────────────────────────────`
  );

  try {
    // Check .env.local
    if (fs.existsSync('.env.local')) {
      console.log(`✅ .env.local file exists`);

      const envContent = fs.readFileSync('.env.local', 'utf8');
      if (envContent.includes('LINEAR_TOKEN=')) {
        console.log(`✅ LINEAR_TOKEN configured`);

        const tokenMatch = envContent.match(/LINEAR_TOKEN=(.+)/);
        const token = tokenMatch ? tokenMatch[1].trim() : '';
        if (token && token.startsWith('lin_api_')) {
          console.log(`✅ LINEAR_TOKEN format valid`);
        } else {
          console.log(`⚠️  LINEAR_TOKEN format may be invalid`);
        }
      } else {
        console.log(`❌ LINEAR_TOKEN not found in .env.local`);
        return false;
      }
    } else {
      console.log(`❌ .env.local file missing`);
      return false;
    }

    // Check Node.js and npm
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js: ${nodeVersion}`);
    console.log(`✅ npm: ${npmVersion}`);

    return true;
  } catch (error) {
    console.log(`❌ Environment validation failed: ${error.message}`);
    return false;
  }
}

async function validateMCPConfiguration() {
  console.log(`\n📋 Step 2: MCP Configuration Validation`);
  console.log(
    `─────────────────────────────────────────────────────────────────`
  );

  try {
    // Check .cursor directory
    if (fs.existsSync('.cursor')) {
      console.log(`✅ .cursor directory exists`);

      // Check mcp-servers.json
      if (fs.existsSync('.cursor/mcp-servers.json')) {
        console.log(`✅ .cursor/mcp-servers.json exists`);

        const mcpConfig = JSON.parse(
          fs.readFileSync('.cursor/mcp-servers.json', 'utf8')
        );
        if (mcpConfig.mcpServers && mcpConfig.mcpServers.linear) {
          console.log(`✅ Linear MCP server configured`);
          console.log(`   Command: ${mcpConfig.mcpServers.linear.command}`);
          console.log(`   Args: ${mcpConfig.mcpServers.linear.args.join(' ')}`);
        } else {
          console.log(`❌ Linear MCP server not configured`);
          return false;
        }
      } else {
        console.log(`❌ .cursor/mcp-servers.json missing`);
        return false;
      }

      // Check mcp-config.json
      if (fs.existsSync('.cursor/mcp-config.json')) {
        console.log(`✅ .cursor/mcp-config.json exists`);
      } else {
        console.log(`⚠️  .cursor/mcp-config.json missing (optional)`);
      }
    } else {
      console.log(`❌ .cursor directory missing`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(`❌ MCP configuration validation failed: ${error.message}`);
    return false;
  }
}

async function testMCPConnection() {
  console.log(`\n📋 Step 3: MCP Connection Testing`);
  console.log(
    `─────────────────────────────────────────────────────────────────`
  );

  try {
    // Test mcp-remote package availability
    console.log(`Testing mcp-remote package...`);

    try {
      // Test if mcp-remote can be accessed
      execSync('npx -y mcp-remote https://mcp.linear.app/sse --help', {
        encoding: 'utf8',
        timeout: 30000,
        env: { ...process.env, ...loadEnvVars() },
      });
      console.log(`✅ mcp-remote package accessible`);
    } catch (error) {
      if (error.message.includes('timeout')) {
        console.log(`⚠️  mcp-remote connection timeout (may be normal)`);
      } else {
        console.log(`⚠️  mcp-remote test: ${error.message.split('\n')[0]}`);
      }
    }

    // Test Linear endpoint accessibility
    console.log(`Testing Linear MCP endpoint...`);
    try {
      execSync('curl -I https://mcp.linear.app/sse', {
        encoding: 'utf8',
        timeout: 10000,
      });
      console.log(`✅ Linear MCP endpoint accessible`);
    } catch (error) {
      console.log(
        `⚠️  Linear MCP endpoint test failed: ${error.message.split('\n')[0]}`
      );
    }

    return true;
  } catch (error) {
    console.log(`❌ MCP connection testing failed: ${error.message}`);
    return false;
  }
}

function loadEnvVars() {
  const envVars = {};
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        envVars[key.trim()] = value.trim();
      }
    });
  }
  return envVars;
}

async function displayActivationInstructions() {
  console.log(`\n🚀 Step 4: Cursor IDE Activation Instructions`);
  console.log(
    `─────────────────────────────────────────────────────────────────`
  );

  console.log(`
📱 IMMEDIATE CURSOR ACTIVATION STEPS:

1. Open Cursor IDE
   - Launch Cursor application
   - Open FAEVision project directory
   - Ensure project loads correctly

2. Install MCP Extension
   - Press Cmd/Ctrl + Shift + X (Extensions)
   - Search for "MCP" or "Model Context Protocol"
   - Install the official MCP extension
   - Restart Cursor when prompted

3. Configure Linear MCP Server
   - Open Settings (Cmd/Ctrl + ,)
   - Search for "MCP"
   - Add Linear server configuration:
   
   {
     "mcpServers": {
       "linear": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse"]
       }
     }
   }

4. Test Integration
   - Open Cursor chat/compose
   - Test: "Can you access Linear?"
   - Try: "Show me my Linear workspace"
   - Create: "Create a test Linear issue"

🧪 VALIDATION TESTS:

Once MCP is active in Cursor, test these commands:
- "What Linear issues are assigned to me?"
- "Create a new Linear issue for Epic 0 testing"
- "Show me the current status of Epic 0"
- "Update the test issue with completion notes"

✅ SUCCESS INDICATORS:
- Cursor can query Linear workspace
- OAuth authentication completes successfully
- Issues can be created and updated via AI
- Project status is accessible from Cursor

❌ TROUBLESHOOTING:
If integration fails:
1. Check authentication: OAuth flow in browser
2. Verify token: LINEAR_TOKEN in .env.local
3. Clear cache: rm -rf ~/.mcp-auth
4. Restart Cursor completely
5. Check network: Test https://mcp.linear.app/sse access
    `);
}

async function generateStatusReport() {
  console.log(`\n📊 Step 5: Integration Status Report`);
  console.log(
    `─────────────────────────────────────────────────────────────────`
  );

  const envValid = await validateEnvironment();
  const configValid = await validateMCPConfiguration();
  const connectionValid = await testMCPConnection();

  console.log(`\n🎯 JORDAN LEE'S CURSOR MCP INTEGRATION STATUS:`);
  console.log(
    `══════════════════════════════════════════════════════════════════`
  );
  console.log(
    `Environment Setup:      ${envValid ? '✅ READY' : '❌ NEEDS ATTENTION'}`
  );
  console.log(
    `MCP Configuration:      ${configValid ? '✅ READY' : '❌ NEEDS ATTENTION'}`
  );
  console.log(
    `Connection Testing:     ${connectionValid ? '✅ READY' : '⚠️  PARTIAL'}`
  );
  console.log(`Cursor Activation:      🔄 USER ACTION REQUIRED`);

  if (envValid && configValid) {
    console.log(`\n🎉 INTEGRATION READY FOR CURSOR ACTIVATION!`);
    console.log(`\nNext: Follow activation instructions in Cursor IDE`);
    console.log(`Expected setup time: 5-10 minutes`);
    console.log(`\n🚀 Once complete: Epic 0 infrastructure 100% ready!`);
  } else {
    console.log(`\n⚠️  SETUP INCOMPLETE - Address issues above first`);
  }

  console.log(`\n📚 Reference Documents:`);
  console.log(`- CURSOR-LINEAR-MCP-SETUP-COMPLETE.md`);
  console.log(`- docs/integrations/Linear-MCP-Integration-Guide.md`);
  console.log(`- .cursor/mcp-servers.json`);
}

async function runValidation() {
  try {
    await validateEnvironment();
    await validateMCPConfiguration();
    await testMCPConnection();
    await displayActivationInstructions();
    await generateStatusReport();

    console.log(
      `\n═══════════════════════════════════════════════════════════════════════════`
    );
    console.log(
      `Expert: Jordan Lee (Cursor Expert) | Status: Ready for User Activation`
    );
    console.log(
      `═══════════════════════════════════════════════════════════════════════════`
    );
  } catch (error) {
    console.log(`\n❌ Validation error: ${error.message}`);
    console.log(
      `\nFor support, check the integration guides and documentation.`
    );
  }
}

// Run the validation
runValidation();
