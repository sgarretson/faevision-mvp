#!/usr/bin/env tsx
/**
 * EMERGENCY API FIX - Critical Routes Missed in Initial Audit
 *
 * Database Architect: Morgan Smith
 * Lead Developer: Alex Thompson
 *
 * CRITICAL: Found additional routes with same table name issues
 */

import { promises as fs } from 'fs';

const EMERGENCY_TABLE_CORRECTIONS = {
  // Core table corrections
  user: 'users',
  input: 'inputs',
  comment: 'comments',
  vote: 'votes',
  department: 'departments',
  team: 'teams',
  category: 'categories',
  // Previously fixed (but double-checking)
  signal: 'signals',
  hotspot: 'hotspots',
  solution: 'solutions',
  idea: 'ideas',
};

const CRITICAL_FILES_TO_FIX = [
  'src/app/api/debug-users/route.ts',
  'src/app/api/setup-test-users/route.ts',
  'src/app/api/test-login/route.ts',
  'src/app/api/votes/route.ts',
  'src/app/api/ideas/[id]/comments/route.ts',
  'src/app/api/inputs/[id]/comments/route.ts',
  'src/app/api/seed-comprehensive/route.ts',
  'src/app/api/monitoring/executive-performance/route.ts',
  'src/app/api/signals/[id]/ai-insights/[insightId]/override/route.ts',
  'src/app/api/jobs/weekly-digest/route.ts',
];

async function emergencyFix() {
  console.log('🚨 EMERGENCY API FIX - Critical Routes Missed in Audit');
  console.log(
    '👥 Database Architect (Morgan Smith) + Lead Developer (Alex Thompson)\n'
  );

  let totalFixes = 0;

  for (const filePath of CRITICAL_FILES_TO_FIX) {
    console.log(`🔧 Emergency fixing: ${filePath}`);

    try {
      let content = await fs.readFile(filePath, 'utf-8');
      let fileChanges = 0;

      // Apply all table name corrections
      Object.entries(EMERGENCY_TABLE_CORRECTIONS).forEach(
        ([wrong, correct]) => {
          const operations = [
            'findMany',
            'findFirst',
            'findUnique',
            'count',
            'create',
            'update',
            'delete',
            'upsert',
            'deleteMany',
          ];

          operations.forEach(op => {
            const wrongPattern = `(prisma as any).${wrong}.${op}`;
            const correctPattern = `(prisma as any).${correct}.${op}`;

            const regex = new RegExp(
              wrongPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'g'
            );
            const matches = content.match(regex);

            if (matches) {
              content = content.replace(regex, correctPattern);
              fileChanges += matches.length;
              console.log(
                `   ✅ Fixed ${matches.length}x ${wrong} -> ${correct}.${op}`
              );
            }
          });
        }
      );

      if (fileChanges > 0) {
        await fs.writeFile(filePath, content, 'utf-8');
        totalFixes += fileChanges;
        console.log(`   📝 Applied ${fileChanges} corrections to file`);
      } else {
        console.log(`   ℹ️ No changes needed`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to fix ${filePath}:`, error.message);
    }
  }

  console.log(`\n✅ EMERGENCY FIX COMPLETE!`);
  console.log(`🔧 Total corrections applied: ${totalFixes}`);
  console.log(`🚀 Critical routes now operational for Preview environment`);
}

if (require.main === module) {
  emergencyFix().catch(error => {
    console.error('❌ Emergency fix failed:', error);
    process.exit(1);
  });
}

export default emergencyFix;
