/*
  Force-run batch AI processing (tagging + features) for all signals in Preview.
  Usage: node scripts/run-batch-ai.js
*/

const https = require('https');
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const data = options.body || null;
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + (u.search || ''),
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      res => {
        let body = '';
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => {
              try {
                return JSON.parse(body || '{}');
              } catch {
                return {};
              }
            },
            text: async () => body,
          });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const base = process.env.NEXTAUTH_URL || process.env.APP_BASE_URL;
  if (!base) {
    console.error('❌ Set NEXTAUTH_URL (preview URL) to call the API.');
    process.exit(1);
  }

  console.log('🔗 Using base URL:', base);

  const tagRes = await fetch(`${base}/api/signals/batch-tag-generation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maxSignals: 1000, forceRegenerate: true }),
  });
  const tagJson = await tagRes.json().catch(() => ({}));
  console.log('🏷️  Batch Tagging:', tagJson);

  const featRes = await fetch(`${base}/api/signals/batch-feature-generation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maxSignals: 1000, forceRegenerate: true }),
  });
  const featJson = await featRes.json().catch(() => ({}));
  console.log('🧩 Batch Features:', featJson);
}

main().catch(err => {
  console.error('❌ Batch run failed:', err);
  process.exit(1);
});
