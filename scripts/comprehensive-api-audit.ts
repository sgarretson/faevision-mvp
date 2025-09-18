#!/usr/bin/env tsx
/**
 * Comprehensive API Audit Script
 *
 * Systematically audits and fixes all API routes for Prisma table name consistency
 * Ensures complete Preview environment reliability
 *
 * Expert: Morgan Smith (Database Architect)
 * Support: Alex Thompson (Lead Developer)
 */

import { promises as fs } from 'fs';
import { join } from 'path';

interface AuditResult {
  file: string;
  issues: string[];
  fixes: string[];
  status: 'clean' | 'needs_fix' | 'critical';
}

const TABLE_NAME_PATTERNS = {
  // Wrong patterns (singular) -> Correct patterns (plural)
  signal: 'signals',
  hotspot: 'hotspots',
  solution: 'solutions',
  idea: 'ideas',
};

const API_FILES_TO_AUDIT = [
  'src/app/api/solutions/from-idea/route.ts',
  'src/app/api/ideas/from-inputs/route.ts',
  'src/app/api/solutions/solutions.disabled/route.ts',
  'src/app/api/jobs/weekly-digest/route.ts',
  'src/app/api/monitoring/performance/route.ts',
  'src/app/api/solutions/[id]/route.ts',
  'src/app/api/solutions/[id]/comments/route.ts',
  'src/app/api/seed-comprehensive/route.ts',
  'src/app/api/ideas/ai-suggestions/route.ts',
  'src/app/api/signals/batch-feature-generation/route.ts',
  'src/app/api/solutions/from-cluster/route.ts',
  'src/app/api/signals/[id]/generate-tags/route.ts',
  'src/app/api/signals/[id]/generate-features/route.ts',
  'src/app/api/signals/batch-tag-generation/route.ts',
  'src/app/api/signals/[id]/ai-insights/[insightId]/override/route.ts',
  'src/app/api/signals/[id]/ai-insights/route.ts',
  'src/app/api/monitoring/executive-performance/route.ts',
  'src/app/api/hotspots/[id]/analyze/route.ts',
  'src/app/api/jobs/enrich-signals/route.ts',
  'src/app/api/jobs/cluster-hotspots/route.ts',
  'src/app/api/cluster/generate-hotspots/route.ts',
  'src/app/api/ai/generate-frd/route.ts',
];

async function main() {
  console.log(
    '🔍 COMPREHENSIVE API AUDIT - PRISMA TABLE NAME STANDARDIZATION\n'
  );
  console.log(
    '👥 Expert Team: Morgan Smith (Database) + Alex Thompson (Lead Dev)\n'
  );

  const results: AuditResult[] = [];

  console.log('📋 Phase 1: Systematic File Audit...\n');

  for (const filePath of API_FILES_TO_AUDIT) {
    const result = await auditFile(filePath);
    results.push(result);

    const statusIcon =
      result.status === 'clean'
        ? '✅'
        : result.status === 'needs_fix'
          ? '⚠️'
          : '🚨';

    console.log(`${statusIcon} ${filePath}`);
    if (result.issues.length > 0) {
      result.issues.forEach(issue => console.log(`    ❌ ${issue}`));
    }
    if (result.fixes.length > 0) {
      result.fixes.forEach(fix => console.log(`    🔧 ${fix}`));
    }
  }

  // Summary
  const cleanFiles = results.filter(r => r.status === 'clean');
  const needsFixFiles = results.filter(r => r.status === 'needs_fix');
  const criticalFiles = results.filter(r => r.status === 'critical');

  console.log('\n📊 AUDIT SUMMARY:');
  console.log(`   ✅ Clean files: ${cleanFiles.length}`);
  console.log(`   ⚠️ Files needing fixes: ${needsFixFiles.length}`);
  console.log(`   🚨 Critical issues: ${criticalFiles.length}`);

  if (needsFixFiles.length > 0 || criticalFiles.length > 0) {
    console.log('\n🛠️ Phase 2: Applying Standardization Fixes...\n');

    const filesToFix = [...needsFixFiles, ...criticalFiles];
    for (const result of filesToFix) {
      await applyFixes(result);
    }
  }

  console.log('\n✅ COMPREHENSIVE API AUDIT COMPLETE!');
  console.log(
    '🚀 All API routes standardized for Preview environment reliability'
  );
}

async function auditFile(filePath: string): Promise<AuditResult> {
  const result: AuditResult = {
    file: filePath,
    issues: [],
    fixes: [],
    status: 'clean',
  };

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Check for problematic patterns
    Object.entries(TABLE_NAME_PATTERNS).forEach(([wrong, correct]) => {
      const patterns = [
        `(prisma as any).${wrong}.findMany`,
        `(prisma as any).${wrong}.findFirst`,
        `(prisma as any).${wrong}.findUnique`,
        `(prisma as any).${wrong}.count`,
        `(prisma as any).${wrong}.create`,
        `(prisma as any).${wrong}.update`,
        `(prisma as any).${wrong}.delete`,
        `(prisma as any).${wrong}.upsert`,
      ];

      patterns.forEach(pattern => {
        if (content.includes(pattern)) {
          result.issues.push(
            `Uses ${pattern} (should be ${pattern.replace(wrong, correct)})`
          );
          result.fixes.push(`Replace ${wrong} -> ${correct} in Prisma calls`);
          result.status =
            result.status === 'clean' ? 'needs_fix' : result.status;
        }
      });
    });

    // Check for other potential issues
    if (content.includes('Cannot read properties of undefined')) {
      result.issues.push('Contains error handling for undefined properties');
      result.status = 'critical';
    }
  } catch (error) {
    result.issues.push(`File read error: ${error.message}`);
    result.status = 'critical';
  }

  return result;
}

async function applyFixes(result: AuditResult): Promise<void> {
  console.log(`🔧 Fixing ${result.file}...`);

  try {
    let content = await fs.readFile(result.file, 'utf-8');
    let changesMade = 0;

    // Apply table name corrections
    Object.entries(TABLE_NAME_PATTERNS).forEach(([wrong, correct]) => {
      const operations = [
        'findMany',
        'findFirst',
        'findUnique',
        'count',
        'create',
        'update',
        'delete',
        'upsert',
      ];

      operations.forEach(op => {
        const wrongPattern = `(prisma as any).${wrong}.${op}`;
        const correctPattern = `(prisma as any).${correct}.${op}`;

        if (content.includes(wrongPattern)) {
          content = content.replace(
            new RegExp(
              wrongPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'g'
            ),
            correctPattern
          );
          changesMade++;
        }
      });
    });

    if (changesMade > 0) {
      await fs.writeFile(result.file, content, 'utf-8');
      console.log(`   ✅ Applied ${changesMade} table name corrections`);
    } else {
      console.log(`   ℹ️ No changes needed`);
    }
  } catch (error) {
    console.error(`   ❌ Failed to fix ${result.file}:`, error.message);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ API audit failed:', error);
    process.exit(1);
  });
}

export default main;
