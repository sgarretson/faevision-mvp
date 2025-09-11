#!/bin/bash

# FAEVision Production Deployment Script
# Expert: Jordan Kim (Vercel Engineer)
# Purpose: Deploy FAEVision F1-F6 MVP to production

set -e

echo "🚀 Starting FAEVision Production Deployment..."

# Verify we're on the correct branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Error: Must deploy from main branch. Current branch: $current_branch"
    exit 1
fi

# Verify all tests pass
echo "🧪 Running pre-deployment tests..."
npm run lint
npm run type-check
npm run test
npm run test:e2e

# Build and verify the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel production
echo "🌐 Deploying to Vercel production..."
vercel --prod --yes

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 30

# Run post-deployment health checks
echo "🏥 Running post-deployment health checks..."

# Check if the site is responding
production_url="https://faevision.com"
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$production_url")

if [ "$status_code" = "200" ]; then
    echo "✅ Production site is responding (HTTP $status_code)"
else
    echo "❌ Production site is not responding (HTTP $status_code)"
    exit 1
fi

# Check API health endpoint
api_status=$(curl -s -o /dev/null -w "%{http_code}" "$production_url/api/health")

if [ "$api_status" = "200" ]; then
    echo "✅ Production API is healthy (HTTP $api_status)"
else
    echo "❌ Production API is not healthy (HTTP $api_status)"
    exit 1
fi

# Check database connectivity
db_status=$(curl -s -o /dev/null -w "%{http_code}" "$production_url/api/health/database")

if [ "$db_status" = "200" ]; then
    echo "✅ Production database is connected (HTTP $db_status)"
else
    echo "❌ Production database connection failed (HTTP $db_status)"
    exit 1
fi

echo "🎉 Production deployment completed successfully!"
echo "📈 Dashboard: https://vercel.com/faevision/faevision-mvp"
echo "🌐 Production URL: $production_url"
echo "📊 Analytics: https://vercel.com/faevision/faevision-mvp/analytics"

# Send deployment notification (if webhook configured)
if [ -n "$DEPLOYMENT_WEBHOOK" ]; then
    curl -X POST "$DEPLOYMENT_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"🚀 FAEVision MVP successfully deployed to production: $production_url\"}"
fi

echo "✅ FAEVision F1-F6 MVP is now live in production!"
