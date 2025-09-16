# GitHub MCP Server Setup - FAEVision

## 🤖 AI-Enhanced Development with GitHub MCP

**Experts:** Taylor Morgan (GitHub Expert) + Jordan Lee (Cursor Expert)  
**Integration:** GitHub MCP Server + Cursor IDE  
**Purpose:** AI-driven GitHub operations for FAEVision development

---

## 🚀 Quick Setup

### Prerequisites

```bash
# Verify Docker is installed (for MCP server)
docker --version

# Verify GitHub CLI (optional but recommended)
gh --version
```

### GitHub MCP Server Installation

**Method 1: Docker (Recommended)**

```bash
# Pull the official GitHub MCP Server
docker pull ghcr.io/github/github-mcp-server:latest

# Test connection (requires GitHub Personal Access Token)
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<your-token> \
  ghcr.io/github/github-mcp-server
```

**Method 2: Binary Installation (macOS)**

```bash
# Download latest release
curl -LO https://github.com/github/github-mcp-server/releases/latest/download/github-mcp-server-darwin-amd64
chmod +x github-mcp-server-darwin-amd64
mv github-mcp-server-darwin-amd64 /usr/local/bin/github-mcp-server
```

---

## 🔧 Cursor IDE Integration

### Configure Cursor MCP Settings

Create or update `.cursor/settings.json`:

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "docker",
        "args": [
          "run",
          "-i",
          "--rm",
          "-e",
          "GITHUB_PERSONAL_ACCESS_TOKEN",
          "-e",
          "GITHUB_TOOLSETS",
          "ghcr.io/github/github-mcp-server"
        ],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}",
          "GITHUB_TOOLSETS": "repos,issues,pull_requests,actions,code_security"
        }
      }
    }
  }
}
```

### Environment Configuration

Add to your `.env.local`:

```bash
# GitHub MCP Configuration
GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token_here"
GITHUB_TOOLSETS="repos,issues,pull_requests,actions,code_security"
```

---

## 🎯 FAEVision-Specific Configuration

### Toolset Selection

For FAEVision MVP development, use these toolsets:

```bash
export GITHUB_TOOLSETS="repos,issues,pull_requests,actions,code_security"
```

**Available Toolsets:**

- `repos` - Repository management
- `issues` - Issue creation and management
- `pull_requests` - PR creation and review
- `actions` - GitHub Actions workflow management
- `code_security` - Security scanning and advisories
- `experiments` - Copilot coding agent (optional)

### Read-Only Mode (Safe Exploration)

```bash
# For learning and exploration
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<token> \
  -e GITHUB_READ_ONLY=1 \
  ghcr.io/github/github-mcp-server
```

---

## 🔗 Integration with FAEVision Workflow

### Linear + GitHub Sync

The MCP server enables:

- Automatic GitHub issue creation from Linear stories
- PR status updates in Linear
- Automated branch creation for Linear tasks

### AI-Enhanced Operations

With Cursor + GitHub MCP:

```bash
# AI can now:
# - Create issues automatically
# - Generate PR descriptions
# - Review code changes
# - Monitor CI/CD status
# - Create release notes
```

### Example AI Workflows

```bash
# AI Prompt Examples:
"Create a GitHub issue for implementing the voting component"
"Generate a PR for the authentication system"
"Check the status of our CI/CD pipeline"
"Review the security advisories for our dependencies"
```

---

## 🛠️ Available MCP Tools

### Repository Management

- `create_repository` - Create new repositories
- `get_repository` - Get repository information
- `list_repositories` - List user/org repositories
- `fork_repository` - Fork repositories

### Issue Management

- `create_issue` - Create new issues
- `get_issue` - Get issue details
- `list_issues` - List repository issues
- `update_issue` - Update issue status/content
- `add_issue_comment` - Add comments to issues

### Pull Request Management

- `create_pull_request` - Create new PRs
- `get_pull_request` - Get PR details
- `list_pull_requests` - List repository PRs
- `merge_pull_request` - Merge approved PRs
- `create_pull_request_review` - Review PRs

### GitHub Actions

- `list_workflow_runs` - Monitor CI/CD
- `get_workflow_run` - Get run details
- `list_workflows` - List available workflows

### Security & Code Quality

- `list_repository_security_advisories` - Security scan
- `create_repository_security_advisory` - Report issues

---

## ⚙️ Advanced Configuration

### Custom Toolsets

```bash
# Development phase toolsets
GITHUB_TOOLSETS="repos,issues,pull_requests"

# Production phase toolsets
GITHUB_TOOLSETS="repos,actions,code_security"

# Full feature set
GITHUB_TOOLSETS="all"
```

### Dynamic Toolset Discovery

```bash
# Enable dynamic toolsets (beta)
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<token> \
  -e GITHUB_DYNAMIC_TOOLSETS=1 \
  ghcr.io/github/github-mcp-server
```

---

## 🔒 Security Best Practices

### GitHub Token Setup

```bash
# Create a Personal Access Token with minimal required scopes:
# - repo (for repository access)
# - workflow (for Actions)
# - security_events (for security features)

# Never commit tokens to Git
echo "GITHUB_PERSONAL_ACCESS_TOKEN=your_token" >> .env.local
echo ".env.local" >> .gitignore
```

### Secure Token Storage

```bash
# Use environment variables
export GITHUB_PERSONAL_ACCESS_TOKEN="your_token"

# Or use Cursor's secure input prompts
# Token will be prompted securely when needed
```

---

## 🚀 Usage Examples

### Creating Issues via AI

```typescript
// AI can now create GitHub issues automatically
// Example: "Create an issue for implementing F1 input capture"
// Result: GitHub issue created with proper labels, assignees, epic links
```

### Automated PR Workflow

```typescript
// AI workflow:
// 1. Create feature branch
// 2. Implement changes
// 3. Create PR with description
// 4. Request reviews from experts
// 5. Monitor CI/CD status
```

### Integration with Linear

```typescript
// Bi-directional sync:
// Linear Story → GitHub Issue → GitHub PR → Linear Update
```

---

## 🐛 Troubleshooting

### Common Issues

**MCP Server Not Starting:**

```bash
# Check Docker
docker ps
docker logs <container_id>

# Check token permissions
curl -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
  https://api.github.com/user
```

**Cursor Integration Issues:**

```bash
# Restart Cursor
# Check .cursor/settings.json syntax
# Verify environment variables
```

**Permission Errors:**

```bash
# Verify token scopes in GitHub settings
# Check repository access permissions
# Ensure organization membership (if applicable)
```

---

## 📞 Support

### Expert Contacts

- **GitHub MCP Issues:** Taylor Morgan (GitHub Expert)
- **Cursor Integration:** Jordan Lee (Cursor Expert)
- **Workflow Setup:** Alex Johnson (Linear Expert)

### Useful Resources

- [GitHub MCP Server Documentation](https://github.com/github/github-mcp-server)
- [Cursor MCP Configuration Guide](https://cursor.sh/docs/mcp)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

**Quick Start:** Install Docker, get a GitHub token, configure Cursor settings, and start using AI-enhanced GitHub operations immediately!
