# 🎯 IMMEDIATE PRODUCTION ENVIRONMENT SETUP

**Expert Assignment: Jordan Kim (Vercel Engineer)**
**Priority: URGENT - Required for authentication to work**

## 🚨 Current Issue
- Production site loads: ✅ https://faevision-simplified.vercel.app  
- Authentication fails: ❌ `/api/auth/providers` returns 500 error
- Root cause: Missing environment variables in Production environment

## 🔧 Vercel Dashboard Configuration (IMMEDIATE ACTION)

### **Step 1: Access Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Find: `faevision-simplified` project
3. Navigate: **Settings** → **Environment Variables**

### **Step 2: Add Production Environment Variables**

**Environment Scope: `Production`**  
**Branch Pattern: `main`**

| Variable | Value | Notes |
|----------|--------|-------|
| `NEXTAUTH_SECRET` | `dabc0c10bf1d6e4d1a481c3b8fdaf3ace2111a806570d46e147eb25424f36692` | Generated secure 64-char hex |
| `NEXTAUTH_URL` | `https://faevision-simplified.vercel.app` | Production domain |
| `DATABASE_URL` | `[PRODUCTION_DATABASE_POOLER_URL]` | **REQUIRED: Production Postgres pooler** |
| `DIRECT_URL` | `[PRODUCTION_DATABASE_DIRECT_URL]` | **REQUIRED: Production Postgres direct** |
| `OPENAI_API_KEY` | `[PRODUCTION_OPENAI_KEY]` | For AI features (F1 auto-tagging) |
| `NODE_ENV` | `production` | Environment identifier |

### **Step 3: Production Database Setup**

**CRITICAL: We need a production database separate from Preview/Development**

Current databases:
- 🔵 Preview: `ep-round-frost-aecda5ou` (configured)
- 🟢 Development: `ep-lingering-queen-ae13d5gh` (configured)  
- 🟡 **Production: MISSING** ← **CREATE THIS**

**Action Required:**
1. Create new Vercel Postgres database for Production
2. Get connection strings (pooler + direct)
3. Add to environment variables above
4. Run database seeding for production users

### **Step 4: Trigger Production Deployment**

After adding environment variables:

```bash
# Option 1: Push a small change to main branch
git checkout main
git commit --allow-empty -m "fix: trigger production deployment with env vars"
git push origin main

# Option 2: Force redeploy in Vercel Dashboard
# Go to Deployments → Latest → "Redeploy"
```

### **Step 5: Verify Authentication Works**

Test these endpoints after deployment:

```bash
# 1. Auth providers endpoint (should return JSON, not 500)
curl -s "https://faevision-simplified.vercel.app/api/auth/providers"
# Expected: {"credentials":{"name":"credentials"}}

# 2. Login page (should load without errors)  
curl -I "https://faevision-simplified.vercel.app/login"
# Expected: 200 OK

# 3. Dashboard (should redirect to login if not authenticated)
curl -I "https://faevision-simplified.vercel.app/dashboard"  
# Expected: 302 redirect to /login
```

## 🎯 Success Criteria

- [ ] All environment variables added to Production scope
- [ ] New deployment triggered and successful
- [ ] `/api/auth/providers` returns JSON (not 500 error)
- [ ] Login page loads without errors
- [ ] Authentication flow works end-to-end

## ⏰ Timeline

- **Now**: Add environment variables in Vercel Dashboard
- **5 min**: Trigger new deployment
- **10 min**: Test authentication endpoints
- **15 min**: Verify full login flow works

## 🚀 Next Steps After Production is Fixed

1. **Fix Preview/Development URLs** (they should auto-deploy once env vars are set)
2. **Create Production database and seed with demo users**
3. **Complete end-to-end authentication testing**
4. **Update Linear issue FAE-77 status**

---

**Status**: Ready for immediate Vercel Dashboard configuration  
**Blocking**: Manual environment variable setup required  
**Impact**: Authentication will work once configured  
