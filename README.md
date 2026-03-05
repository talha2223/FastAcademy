# The Fast Academy of Sciences

## Quick Vercel Deploy
1. Push this project to GitHub.
2. In Vercel, click `New Project` and import this repo.
3. In Vercel `Storage`, connect:
   - Postgres (required)
   - Blob (required for image uploads)
4. In Vercel `Settings -> Environment Variables`, add:
   - `NEXTAUTH_SECRET` (long random string)
   - `NEXTAUTH_URL` (`https://your-project.vercel.app`)
   - `SETUP_CODE` (your private setup code)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob)
   - `DATABASE_URL` (optional if Postgres auto variables are connected)
5. Deploy (build command is already configured in `vercel.json`).
6. Open `https://your-project.vercel.app/setup` once and create the first admin.

## Local Commands
- Install: `npm install`
- Dev: `npm run dev`
- Generate Prisma client: `npm run prisma:generate`
- Push schema: `npm run db:push`

## Notes
- Prisma is configured for PostgreSQL in `prisma/schema.prisma`.
- Vercel build script auto-picks DB URL from:
  - `DATABASE_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL`
- Direct image upload is enabled for teacher photos, post cover images, and profile photos.
- Without Blob token, uploads only work locally in `public/uploads/*`.
