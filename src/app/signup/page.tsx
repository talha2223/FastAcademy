import Link from 'next/link';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ROLES } from '@/lib/roles';

async function createAccount(formData: FormData) {
  'use server';

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').toLowerCase().trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!email || !password) {
    redirect('/signup?error=Please%20fill%20all%20required%20fields');
  }

  if (password.length < 6) {
    redirect('/signup?error=Password%20must%20be%20at%20least%206%20characters');
  }

  if (password !== confirmPassword) {
    redirect('/signup?error=Passwords%20do%20not%20match');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect('/signup?error=Email%20already%20registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: name || null,
      email,
      passwordHash,
      role: ROLES.USER
    }
  });

  redirect('/login?registered=1');
}

export default async function SignupPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const count = await prisma.user.count();
  if (count === 0) {
    redirect('/setup');
  }

  return (
    <section className="section">
      <div className="mx-auto max-w-md px-4">
        <h1 className="section-title text-center">Create Account</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Create your normal user account.</p>
        <div className="mt-6 card p-6">
          <form action={createAccount} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input name="name" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Repeat password"
              />
            </div>
            {searchParams?.error ? <p className="text-sm text-red-600">{decodeURIComponent(searchParams.error)}</p> : null}
            <button type="submit" className="button-primary w-full justify-center">Create Account</button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account? <Link href="/login" className="text-[color:var(--blue)]">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}