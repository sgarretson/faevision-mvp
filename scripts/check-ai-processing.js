/*
  Quick check of AI processing status for signals in the Preview DB
  Usage: node scripts/check-ai-processing.js
*/

const fs = require('fs');
const path = require('path');

// Load .env.preview similar to import script
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
        value = value.replace(/^(["'])(.*)\1$/, '$2');
        process.env[key] = value;
      }
    }
    console.log('✅ Loaded .env.preview');
  } else {
    console.log('ℹ️  .env.preview not found; relying on existing env');
  }
}

loadPreviewEnv();

const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL },
  },
});

async function main() {
  const total = await prisma.signal.count();
  const processed = await prisma.signal.count({ where: { aiProcessed: true } });
  // For JSONB columns, use "not: null" semantics in Prisma 6
  const withEnhanced = await prisma.signal.count({
    where: { enhancedTagsJson: { not: null } },
  });
  const withFeatures = await prisma.signal.count({
    where: { clusteringFeaturesJson: { not: null } },
  });

  const unprocessed = await prisma.signal.findMany({
    where: { aiProcessed: false },
    select: { id: true, title: true },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  console.log('\n===== AI Processing Status =====');
  console.log('Total signals        :', total);
  console.log('aiProcessed=true     :', processed);
  console.log('Enhanced tags present:', withEnhanced);
  console.log('Features present     :', withFeatures);
  console.log(
    'Remaining (first 10) :',
    unprocessed.map(s => s.id + (s.title ? ` — ${s.title}` : ''))
  );
}

main()
  .catch(e => {
    console.error('Failed to read AI processing status:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
