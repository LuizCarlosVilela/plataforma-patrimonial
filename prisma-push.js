require('dotenv').config({ path: '.env.production.local' });
const { execSync } = require('child_process');

// Override PRISMA_URL to non-pooling direct connection
process.env.POSTGRES_PRISMA_URL = process.env.POSTGRES_URL_NON_POOLING;
console.log('Using URL:', process.env.POSTGRES_PRISMA_URL);

try {
  const result = execSync('npx prisma db push --skip-generate', {
    env: { ...process.env },
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024
  });
  console.log(result);
} catch (e) {
  console.error('STDERR:', e.stderr || '');
  console.error('STDOUT:', e.stdout || '');
  process.exit(1);
}
