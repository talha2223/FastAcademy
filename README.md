# The Fast Academy of Sciences

## Firebase Deploy (Simple)
1. Push this project to GitHub.
2. In Firebase Console, create/select your project.
3. Open **App Hosting** and connect this GitHub repo.
4. In App Hosting backend environment variables, add:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Firebase App Hosting URL)
   - `SETUP_CODE`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
5. Deploy from App Hosting.
6. Open `https://your-app-url/setup` once and create the first admin.

## Firebase CLI Commands
- Login: `npm run firebase:login`
- List projects: `npm run firebase:projects`
- Create App Hosting backend: `npm run firebase:apphosting:create`
- Create rollout: `npm run firebase:apphosting:rollout -- <backend-id> --git-branch main`

## Local Commands
- Install: `npm install`
- Dev: `npm run dev`
- Generate Prisma client: `npm run prisma:generate`
- Push schema: `npm run db:push`

## Notes
- Prisma is configured for PostgreSQL in `prisma/schema.prisma`.
- `.firebaserc` is configured with project id `fastacademyburewala`.
- `apphosting.yaml` is included for Firebase App Hosting runtime config.
- Image uploads use Cloudinary.
- In production (Cloud Run), local file fallback is disabled; Cloudinary env vars are required.
