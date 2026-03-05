import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

async function createAdmin(formData: FormData) {
  'use server';

  const setupCode = String(formData.get('setupCode') ?? '').trim();
  const email = String(formData.get('email') ?? '').toLowerCase().trim();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (!process.env.SETUP_CODE || setupCode !== process.env.SETUP_CODE) {
    redirect('/setup?error=Invalid%20setup%20code');
  }

  if (!email || !password) {
    redirect('/setup?error=Email%20and%20password%20required');
  }

  if (password !== confirm) {
    redirect('/setup?error=Passwords%20do%20not%20match');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect('/setup?error=User%20already%20exists');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'ADMIN'
    }
  });

  redirect('/login?setup=success');
}

export default async function SetupPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const count = await prisma.user.count();
  if (count > 0) {
    redirect('/login');
  }

  return (
    <section className="section">
      <div className="mx-auto max-w-md px-4">
        <h1 className="section-title text-center">Initial Setup</h1>
        <div className="mt-6 card p-6">
          <form action={createAdmin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Setup Code</label>
              <input
                name="setupCode"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Enter SETUP_CODE"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Admin Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="talha3356789@gmail.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Create a strong password"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            {searchParams?.error ? (
              <p className="text-sm text-red-600">{decodeURIComponent(searchParams.error)}</p>
            ) : null}
            <button type="submit" className="button-primary w-full justify-center">
              Create Admin
            </button>
            <p className="text-center text-xs text-slate-500">
              This screen is only available before any admin account exists.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}