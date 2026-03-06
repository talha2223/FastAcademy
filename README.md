# The Fast Academy of Sciences

## Vercel Deploy (Simple)
1. Push this project to GitHub.
2. In Vercel, click `Add New...` -> `Project`.
3. Import this GitHub repo and select branch `main`.
4. Framework preset: `Next.js`.
5. In `Project Settings -> Environment Variables`, add:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (long random string)
   - `NEXTAUTH_URL` (for example `https://your-project.vercel.app`)
   - `SETUP_CODE`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Deploy.
7. Open `https://your-project.vercel.app/setup` once and create the first admin.

## Local Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Generate Prisma client: `npm run prisma:generate`
- Push schema: `npm run db:push`

## Notes
- Prisma is configured for PostgreSQL in `prisma/schema.prisma`.
- Vercel config is in `vercel.json`.
- Image uploads use Cloudinary.
- In production server environments, local file upload fallback is disabled; Cloudinary env vars are required.
- Firebase web analytics env vars in `.env.example` are optional.
