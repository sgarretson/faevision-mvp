/**
 * CSV Signal Import Utility
 * Database Architect: Morgan Smith + AI Architect: Dr. Priya Patel
 *
 * Imports strategic signals from CSV file into FAEVision database
 */

import { PrismaClient } from '../src/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

// Load environment variables from .env.preview
function loadPreviewEnv() {
  const envPath = path.join(process.cwd(), '.env.preview');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = envFile
      .split('\n')
      .filter(line => line.includes('=') && !line.startsWith('#'));

    for (const line of envVars) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=');
        value = value.replace(/^["']|["']$/g, '').replace(/\\n$/, '');
        process.env[key] = value;
      }
    }
    console.log('✅ Loaded Preview environment variables');
  }
}

// Load environment
loadPreviewEnv();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

interface CSVRow {
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  department_name?: string;
  team_name?: string;
  category_name?: string;
  source_type?: string;
  system_name?: string;
  privacy_level?: string;
  tags_engineering?: string;
  tags_construction?: string;
  tags_quality?: string;
  tags_client?: string;
  tags_process?: string;
  metric_timeline_days?: string;
  metric_cost_impact?: string;
  metric_hours_affected?: string;
  impact_schedule_delay?: string;
  impact_budget_variance_percent?: string;
  impact_quality_score?: string;
  impact_client_satisfaction?: string;
  baseline_expected_timeline?: string;
  baseline_budget_amount?: string;
  baseline_quality_target?: string;
  entities_vendor?: string;
  entities_client?: string;
  entities_project_phase?: string;
  created_by_email: string;
  additional_context?: string;
}

async function findOrCreateDepartment(name: string) {
  if (!name) return null;

  const existing = await (prisma as any).department.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });

  if (existing) return existing;

  return await (prisma as any).department.create({
    data: {
      name,
      description: `${name} department - auto-created during CSV import`,
      isActive: true,
    },
  });
}

async function findOrCreateTeam(name: string, departmentId?: string) {
  if (!name) return null;

  const existing = await (prisma as any).team.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      departmentId,
    },
  });

  if (existing) return existing;

  return await (prisma as any).team.create({
    data: {
      name,
      description: `${name} team - auto-created during CSV import`,
      departmentId,
      isActive: true,
    },
  });
}

async function findOrCreateCategory(name: string) {
  if (!name) return null;

  const existing = await (prisma as any).category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });

  if (existing) return existing;

  return await (prisma as any).category.create({
    data: {
      name,
      description: `${name} category - auto-created during CSV import`,
      isActive: true,
    },
  });
}

async function findUser(email: string) {
  return await (prisma as any).user.findUnique({
    where: { email },
  });
}

function parseNumericField(value?: string): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

function parseTags(value?: string): string[] {
  if (!value || value.trim() === '') return [];
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

function buildTagsJson(row: CSVRow) {
  const allTags = [
    ...parseTags(row.tags_engineering),
    ...parseTags(row.tags_construction),
    ...parseTags(row.tags_quality),
    ...parseTags(row.tags_client),
    ...parseTags(row.tags_process),
  ];

  return allTags.length > 0
    ? {
        structured: {
          engineering: parseTags(row.tags_engineering),
          construction: parseTags(row.tags_construction),
          quality: parseTags(row.tags_quality),
          client: parseTags(row.tags_client),
          process: parseTags(row.tags_process),
        },
        all: allTags,
      }
    : null;
}

function buildMetricsJson(row: CSVRow) {
  const metrics: any = {};

  const timeline = parseNumericField(row.metric_timeline_days);
  const cost = parseNumericField(row.metric_cost_impact);
  const hours = parseNumericField(row.metric_hours_affected);

  if (timeline !== null) metrics.timelineDays = timeline;
  if (cost !== null) metrics.costImpact = cost;
  if (hours !== null) metrics.hoursAffected = hours;

  return Object.keys(metrics).length > 0 ? metrics : null;
}

function buildImpactJson(row: CSVRow) {
  const impact: any = {};

  const scheduleDelay = parseNumericField(row.impact_schedule_delay);
  const budgetVariance = parseNumericField(row.impact_budget_variance_percent);
  const qualityScore = parseNumericField(row.impact_quality_score);
  const clientSatisfaction = parseNumericField(row.impact_client_satisfaction);

  if (scheduleDelay !== null) impact.scheduleDelayDays = scheduleDelay;
  if (budgetVariance !== null) impact.budgetVariancePercent = budgetVariance;
  if (qualityScore !== null) impact.qualityScore = qualityScore;
  if (clientSatisfaction !== null)
    impact.clientSatisfaction = clientSatisfaction;

  return Object.keys(impact).length > 0 ? impact : null;
}

function buildBaselineJson(row: CSVRow) {
  const baseline: any = {};

  if (row.baseline_expected_timeline)
    baseline.expectedTimeline = row.baseline_expected_timeline;
  if (row.baseline_budget_amount)
    baseline.budgetAmount = row.baseline_budget_amount;
  if (row.baseline_quality_target)
    baseline.qualityTarget = row.baseline_quality_target;

  return Object.keys(baseline).length > 0 ? baseline : null;
}

function buildEntitiesJson(row: CSVRow) {
  const entities: any = {};

  if (row.entities_vendor) entities.vendor = row.entities_vendor;
  if (row.entities_client) entities.client = row.entities_client;
  if (row.entities_project_phase)
    entities.projectPhase = row.entities_project_phase;

  return Object.keys(entities).length > 0 ? entities : null;
}

async function importCsvFile(filePath: string) {
  console.log(`🔄 Starting CSV import from: ${filePath}`);

  const results: CSVRow[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: CSVRow) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`📊 Parsed ${results.length} rows from CSV`);

          let imported = 0;
          let errors = 0;

          for (const row of results) {
            try {
              // Validate required fields
              if (
                !row.title ||
                !row.description ||
                !row.severity ||
                !row.created_by_email
              ) {
                console.warn(
                  `⚠️  Skipping row with missing required fields: ${row.title || 'No title'}`
                );
                errors++;
                continue;
              }

              // Find or create organizational entities
              const department = await findOrCreateDepartment(
                row.department_name || ''
              );
              const team = await findOrCreateTeam(
                row.team_name || '',
                department?.id
              );
              const category = await findOrCreateCategory(
                row.category_name || ''
              );

              // Find user
              const user = await findUser(row.created_by_email);
              if (!user) {
                console.warn(
                  `⚠️  User not found: ${row.created_by_email} for signal: ${row.title}`
                );
                errors++;
                continue;
              }

              // Calculate severity score
              const severityScores = {
                LOW: 1,
                MEDIUM: 2,
                HIGH: 3,
                CRITICAL: 4,
              };

              // Create signal
              const signal = await (prisma as any).signal.create({
                data: {
                  // Core content
                  title: row.title,
                  description: row.description,
                  severity: row.severity,
                  severityScore: severityScores[row.severity],

                  // Source information
                  sourceType: row.source_type || 'manual',
                  systemName: row.system_name || 'CSV Import',
                  privacyLevel: row.privacy_level || 'internal',

                  // Organizational context
                  departmentId: department?.id,
                  teamId: team?.id,
                  categoryId: category?.id,

                  // Structured data
                  tagsJson: buildTagsJson(row),
                  metricsJson: buildMetricsJson(row),
                  impactJson: buildImpactJson(row),
                  baselineJson: buildBaselineJson(row),
                  entitiesJson: buildEntitiesJson(row),

                  // User context
                  createdById: user.id,

                  // Additional context in lineage
                  lineageJson: {
                    source: 'csv_import',
                    importedAt: new Date().toISOString(),
                    additionalContext: row.additional_context,
                    originalRow: row,
                  },

                  // Timestamps
                  timestamp: new Date(),
                  receivedAt: new Date(),
                },
              });

              console.log(`✅ Imported: ${signal.title} (${signal.id})`);
              imported++;
            } catch (error) {
              console.error(`❌ Error importing row: ${row.title}`, error);
              errors++;
            }
          }

          console.log(`\n🎉 Import completed!`);
          console.log(`   ✅ Successfully imported: ${imported} signals`);
          console.log(`   ❌ Errors: ${errors} signals`);
          console.log(`   📊 Total processed: ${results.length} rows`);

          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

async function main() {
  const csvFilePath = process.argv[2];

  if (!csvFilePath) {
    console.error('❌ Please provide a CSV file path');
    console.log(
      'Usage: npx ts-node scripts/import-csv-signals.ts <csv-file-path>'
    );
    console.log(
      'Example: npx ts-node scripts/import-csv-signals.ts docs/seeding/signal-import-template.csv'
    );
    process.exit(1);
  }

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  try {
    await importCsvFile(csvFilePath);
    console.log('🚀 CSV import process completed successfully');
  } catch (error) {
    console.error('❌ CSV import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
