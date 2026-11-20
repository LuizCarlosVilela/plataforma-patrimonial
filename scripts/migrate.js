#!/usr/bin/env node
require('dotenv').config({ path: '.env.production.local' });
const { execSync } = require('child_process');

// Try non-pooling first (direct connection for migrations)
process.env.POSTGRES_PRISMA_URL = process.env.POSTGRES_URL_NON_POOLING;
console.log('Attempting DB migration with direct connection...');

try {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env },
    stdio: 'inherit',
    timeout: 60000
  });
  console.log('Database migrations completed successfully.');
} catch (e) {
  // Fall back to pooling URL if direct connection fails
  console.log('Direct connection failed, trying pooled connection...');
  process.env.POSTGRES_PRISMA_URL = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  try {
    execSync('npx prisma migrate deploy', {
      env: { ...process.env },
      stdio: 'inherit',
      timeout: 60000
    });
    console.log('Database migrations completed successfully (via pool).');
  } catch (e2) {
    console.error('Warning: Migration could not run automatically.', e2.message);
    console.error('Please run manually on the database server or via local terminal.');
    // Don't fail the build - just warn
  }
}
