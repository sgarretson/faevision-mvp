/**
 * FAEVision Global Test Setup
 * Expert: Alex Thompson (Lead Developer)
 * Purpose: Initialize test environment, seed demo data, prepare test state
 */

import { chromium, FullConfig } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

async function globalSetup(config: FullConfig) {
  console.log('🧪 Setting up FAEVision E2E Test Environment...')
  
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
  
  // Initialize database for testing
  await setupTestDatabase()
  
  // Warm up the application
  await warmupApplication(baseURL)
  
  // Create test authentication state
  await createTestAuthState(baseURL)
  
  console.log('✅ FAEVision E2E Test Environment Ready!')
}

async function setupTestDatabase() {
  console.log('📊 Setting up test database...')
  
  const prisma = new PrismaClient()
  
  try {
    // Clean up any existing test data
    await prisma.fRDDocument.deleteMany()
    await prisma.requirement.deleteMany()
    await prisma.task.deleteMany()
    await prisma.solution.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.vote.deleteMany()
    await prisma.input.deleteMany()
    await prisma.user.deleteMany()
    
    // Seed test users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@faevision.com',
        name: 'Admin User',
        role: 'ADMIN',
        department: 'Administration',
        password: '$2a$10$rQZ8vJKnZVzQ4X5N6bGGy.CXjRO9kJGzJy2xhVz3wJ1FH5XQ9YWQK' // demo123 hashed
      }
    })
    
    const executiveUser = await prisma.user.create({
      data: {
        email: 'sarah.chen@faevision.com',
        name: 'Sarah Chen',
        role: 'EXECUTIVE',
        department: 'Strategy',
        password: '$2a$10$rQZ8vJKnZVzQ4X5N6bGGy.CXjRO9kJGzJy2xhVz3wJ1FH5XQ9YWQK' // demo123 hashed
      }
    })
    
    const contributorUser = await prisma.user.create({
      data: {
        email: 'alex.thompson@faevision.com', 
        name: 'Alex Thompson',
        role: 'CONTRIBUTOR',
        department: 'Engineering',
        password: '$2a$10$rQZ8vJKnZVzQ4X5N6bGGy.CXjRO9kJGzJy2xhVz3wJ1FH5XQ9YWQK' // demo123 hashed
      }
    })
    
    // Create test input for workflow testing
    const testInput = await prisma.input.create({
      data: {
        title: 'Test: API Performance Issues',
        description: 'Current API response times affecting executive dashboard performance',
        department: 'ENGINEERING',
        issueType: 'TECHNOLOGY',
        rootCause: 'Database query optimization needed',
        priority: 'HIGH',
        businessImpact: 'Reduced executive productivity',
        status: 'ACTIVE',
        createdBy: executiveUser.id
      }
    })
    
    // Create test collaboration data
    await prisma.vote.create({
      data: {
        voteValue: 'UP',
        entityType: 'INPUT',
        entityId: testInput.id,
        userId: contributorUser.id
      }
    })
    
    await prisma.comment.create({
      data: {
        content: 'Test comment for workflow validation',
        entityType: 'INPUT',
        entityId: testInput.id,
        userId: executiveUser.id
      }
    })
    
    // Create test solution
    const testSolution = await prisma.solution.create({
      data: {
        title: 'API Performance Enhancement Solution',
        description: 'Comprehensive API optimization solution',
        businessValue: 'Improved executive experience with faster response times',
        successMetrics: ['Response time <500ms', 'Zero timeouts', 'Executive satisfaction >90%'],
        priority: 'HIGH',
        status: 'ACTIVE',
        createdBy: executiveUser.id,
        assignedTo: contributorUser.id
      }
    })
    
    // Create test requirement
    await prisma.requirement.create({
      data: {
        title: 'Real-time Performance Monitoring',
        description: 'Implement comprehensive API performance monitoring',
        category: 'TECHNICAL',
        priority: 'HIGH',
        status: 'APPROVED',
        acceptanceCriteria: [
          'Performance metrics visible in real-time',
          'Automated alerts for degradation',
          'Executive dashboard integration'
        ],
        solutionId: testSolution.id,
        createdBy: executiveUser.id,
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    })
    
    console.log('✅ Test database seeded successfully')
    
  } catch (error) {
    console.error('❌ Test database setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function warmupApplication(baseURL: string) {
  console.log('🔥 Warming up application...')
  
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Pre-load critical pages to warm up the application
    await page.goto(`${baseURL}/`)
    await page.waitForLoadState('networkidle')
    
    await page.goto(`${baseURL}/login`)
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Application warmed up successfully')
    
  } catch (error) {
    console.warn('⚠️  Application warmup failed:', error)
    // Don't fail the entire setup if warmup fails
  } finally {
    await browser.close()
  }
}

async function createTestAuthState(baseURL: string) {
  console.log('🔐 Creating test authentication states...')
  
  const browser = await chromium.launch()
  
  // Create admin auth state
  const adminContext = await browser.newContext()
  const adminPage = await adminContext.newPage()
  
  try {
    await adminPage.goto(`${baseURL}/login`)
    await adminPage.fill('[data-testid="email"]', 'admin@faevision.com')
    await adminPage.fill('[data-testid="password"]', 'demo123')
    await adminPage.click('[data-testid="login-submit"]')
    await adminPage.waitForURL('**/dashboard')
    
    // Save admin auth state
    await adminContext.storageState({ path: 'tests/auth/admin-auth.json' })
    
  } catch (error) {
    console.warn('⚠️  Admin auth state creation failed:', error)
  } finally {
    await adminContext.close()
  }
  
  // Create executive auth state
  const executiveContext = await browser.newContext()
  const executivePage = await executiveContext.newPage()
  
  try {
    await executivePage.goto(`${baseURL}/login`)
    await executivePage.fill('[data-testid="email"]', 'sarah.chen@faevision.com')
    await executivePage.fill('[data-testid="password"]', 'demo123')
    await executivePage.click('[data-testid="login-submit"]')
    await executivePage.waitForURL('**/dashboard')
    
    // Save executive auth state
    await executiveContext.storageState({ path: 'tests/auth/executive-auth.json' })
    
  } catch (error) {
    console.warn('⚠️  Executive auth state creation failed:', error)
  } finally {
    await executiveContext.close()
  }
  
  // Create contributor auth state
  const contributorContext = await browser.newContext()
  const contributorPage = await contributorContext.newPage()
  
  try {
    await contributorPage.goto(`${baseURL}/login`)
    await contributorPage.fill('[data-testid="email"]', 'alex.thompson@faevision.com')
    await contributorPage.fill('[data-testid="password"]', 'demo123')
    await contributorPage.click('[data-testid="login-submit"]')
    await contributorPage.waitForURL('**/dashboard')
    
    // Save contributor auth state
    await contributorContext.storageState({ path: 'tests/auth/contributor-auth.json' })
    
  } catch (error) {
    console.warn('⚠️  Contributor auth state creation failed:', error)
  } finally {
    await contributorContext.close()
  }
  
  await browser.close()
  console.log('✅ Test authentication states created')
}

export default globalSetup
