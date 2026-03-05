import { execSync } from 'node:child_process';

function pickDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    ''
  );
}

const databaseUrl = pickDatabaseUrl();

if (!databaseUrl) {
  throw new Error(
    'Missing database URL. Set DATABASE_URL or connect Vercel Postgres so POSTGRES_URL_* vars are available.'
  );
}

process.env.DATABASE_URL = databaseUrl;

execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
execSync('npx next build', { stdio: 'inherit', env: process.env });

