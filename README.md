# The Fast Academy of Sciences

## Quick Vercel Deploy
1. Push this project to GitHub.
2. In Vercel: `New Project` -> import this repo.
3. Add Vercel Storage:
   - Postgres (required)
   - Blob (required for image uploads)
4. Add Environment Variables in Vercel:
   - `DATABASE_URL` (from Vercel Postgres)
   - `NEXTAUTH_SECRET` (long random string)
   - `NEXTAUTH_URL` (`https://your-project.vercel.app`)
   - `SETUP_CODE` (your private setup code)
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob)
5. Deploy (build command already configured in `vercel.json`).
6. Open `https://your-project.vercel.app/setup` once and create admin.

## Local Commands
- Install: `npm install`
- Dev: `npm run dev`
- Generate Prisma: `npm run prisma:generate`
- Push schema: `npm run db:push`

## Notes
- Project is now configured for `PostgreSQL` in Prisma (`prisma/schema.prisma`).
- Direct image upload is enabled for teacher photos, post covers, and profile photos.
- Without Blob token, uploads only work locally in `public/uploads/*`.
