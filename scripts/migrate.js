#!/usr/bin/env node
require('dotenv').config({ path: '.env.production.local' });
const { execSync } = require('child_process');

// Use non-pooling URL for migrations
process.env.POSTGRES_PRISMA_URL = process.env.POSTGRES_URL_NON_POOLING;
console.log('Running database migrations...');

try {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env },
    stdio: 'inherit'
  });
  console.log('Database migrations completed successfully.');
} catch (e) {
  console.error('Migration error:', e.message);
  process.exit(1);
}
