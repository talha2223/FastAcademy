# The Fast Academy of Sciences

## Netlify Deploy (Simple)
1. Push this project to GitHub.
2. In Netlify, click `Add new site` -> `Import an existing project`.
3. Connect this GitHub repo and select branch `main`.
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: leave empty (Netlify Next.js plugin handles this)
5. In Netlify `Site settings -> Environment variables`, add:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Netlify site URL, e.g. `https://your-site.netlify.app`)
   - `SETUP_CODE`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Deploy the site.
7. Open `https://your-site.netlify.app/setup` once and create the first admin.

## Local Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Generate Prisma client: `npm run prisma:generate`
- Push schema: `npm run db:push`

## Notes
- Prisma is configured for PostgreSQL in `prisma/schema.prisma`.
- Netlify support is configured in `netlify.toml` using `@netlify/plugin-nextjs`.
- Image uploads use Cloudinary.
- In production server environments, local file upload fallback is disabled; Cloudinary env vars are required.
- Firebase web analytics env vars in `.env.example` are optional.
