import { runAudit } from './src/lib/audit-engine';

async function test() {
  const url = 'https://www.sprucesalonaustin.com/';
  console.log(`Auditing ${url}...`);
  const result = await runAudit(url);
  console.log('Audit complete!');
  console.log('Images found:', result.images?.length || 0);
  console.log('Warnings:', result.warnings);
}

test().catch(console.error);
